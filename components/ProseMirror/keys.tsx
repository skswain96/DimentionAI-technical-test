import { keymap } from "prosemirror-keymap";
import { undoInputRule } from "prosemirror-inputrules";
import { undo, redo } from "prosemirror-history";
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem,
} from "prosemirror-schema-list";
import {
  baseKeymap,
  toggleMark,
  wrapIn,
  setBlockType,
  chainCommands,
  exitCode,
  joinUp,
  joinDown,
  lift,
  selectParentNode,
} from "prosemirror-commands";
import { Transform, ReplaceStep, canSplit } from "prosemirror-transform";
import { Slice, Fragment, NodeRange } from "prosemirror-model";

import { extendedSchema as schema } from "./schema";

const insertBreak = (state: any, dispatch: any) => {
  const br = schema.nodes.hard_break.create();
  dispatch(state.tr.replaceSelectionWith(br).scrollIntoView());
  return true;
};

const insertRule = (state: any, dispatch: any) => {
  const hr = schema.nodes.horizontal_rule.create();
  dispatch(state.tr.replaceSelectionWith(hr).scrollIntoView());
  return true;
};

const toggleCheckedList = (schema: any) =>
  wrapInList(schema.nodes.checked_list);
const toggleCheck = (schema: any) => (state: any, dispatch: any) => {
  const { tr, selection, schema } = state;
  const { $from } = selection;
  const node = $from.node($from.depth);

  if (node.type === schema.nodes.checked_list_item) {
    const checked = !node.attrs.checked;
    tr.setNodeMarkup($from.pos - $from.parentOffset, null, { checked });
    dispatch(tr);
    return true;
  }
  return false;
};

// @ts-ignore
Transform.prototype.customSplit = function (
  pos: any,
  depth = 1,
  typesAfter: any
) {
  let $pos = this.doc.resolve(pos),
    before = Fragment.empty,
    after = Fragment.empty;
  for (
    let d = $pos.depth, e = $pos.depth - depth, i = depth - 1;
    d > e;
    d--, i--
  ) {
    before = Fragment.from($pos.node(d).copy(before));
    let typeAfter = typesAfter && typesAfter[i];
    // modification 1: get type from node if not specified on typesAfter[i]
    let type = (typeAfter && typeAfter.type) || $pos.node(d).type;
    after = Fragment.from(
      typeAfter ? type.create(typeAfter.attrs, after) : $pos.node(d).copy(after)
    );
  }
  return this.step(
    new ReplaceStep(
      pos,
      pos,
      // @ts-ignore
      new Slice(before.append(after), depth, depth, true)
    )
  );
};

function splitTodoListItem(itemType: any) {
  return function (state: any, dispatch: any) {
    let { $from, $to, node } = state.selection;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to))
      return false;
    let grandParent = $from.node(-1);
    if (grandParent.type != itemType) return false;
    if ($from.parent.content.size == 0) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if (
        $from.depth == 2 ||
        $from.node(-3).type != itemType ||
        $from.index(-2) != $from.node(-2).childCount - 1
      )
        return false;
      if (dispatch) {
        let wrap = Fragment.empty,
          keepItem = $from.index(-1) > 0;
        // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor
        for (
          let d = $from.depth - (keepItem ? 1 : 2);
          d >= $from.depth - 3;
          d--
        )
          wrap = Fragment.from($from.node(d).copy(wrap));
        // Add a second list item with an empty default start node
        wrap = wrap.append(Fragment.from(itemType.createAndFill()));
        let tr = state.tr.replace(
          $from.before(keepItem ? null : -1),
          $from.after(-3),
          new Slice(wrap, keepItem ? 3 : 2, 2)
        );
        tr.setSelection(
          state.selection.constructor.near(
            tr.doc.resolve($from.pos + (keepItem ? 3 : 2))
          )
        );
        dispatch(tr.scrollIntoView());
      }
      return true;
    }
    let nextType =
      $to.pos == $from.end()
        ? grandParent.contentMatchAt($from.indexAfter(-1)).defaultType
        : null;
    let tr = state.tr.delete($from.pos, $to.pos);
    let types = nextType && [null, { type: nextType }];
    if (!canSplit(tr.doc, $from.pos, 2, types)) return false;
    // modification 2: push `done` attribute onto types and use `customSplit` method
    types = types || [];
    types.push({ attrs: { done: false } });
    if (dispatch)
      dispatch(tr.customSplit($from.pos, 2, types).scrollIntoView());
    return true;
  };
}

const keys: any = {
  "Mod-z": undo,
  "Shift-Mod-z": redo,
  Backspace: undoInputRule,
  "Mod-y": redo,
  "Alt-ArrowUp": joinUp,
  "Alt-ArrowDown": joinDown,
  "Mod-BracketLeft": lift,
  Escape: selectParentNode,
  "Mod-b": toggleMark(schema.marks.strong),
  "Mod-i": toggleMark(schema.marks.em),
  "Mod-u": toggleMark(schema.marks.underline),
  "Mod-`": toggleMark(schema.marks.code),
  "Shift-Ctrl-8": wrapInList(schema.nodes.bullet_list),
  "Shift-Ctrl-9": wrapInList(schema.nodes.ordered_list),
  "Ctrl->": wrapIn(schema.nodes.blockquote),
  "Mod-Enter": chainCommands(exitCode, insertBreak),
  "Shift-Enter": chainCommands(exitCode, insertBreak),
  "Ctrl-Enter": chainCommands(exitCode, insertBreak), // mac-only?
  Enter: (state: any, dispatch: any) => {
    const { $from } = state.selection;
    const depth = $from.depth;

    // Check the current node and its parent structure
    const listItem = $from.node(depth);
    const parentNode = $from.node(depth - 1);

    if (
      parentNode.type.name === schema.nodes.list_item.name ||
      parentNode.type.name === "todo_item"
    ) {
      // Check if selection is at the end of the list item
      if ($from.parentOffset === listItem.content.size) {
        if (parentNode.type.name === "todo_item") {
          const todoSplitResult = splitTodoListItem(schema.nodes.todo_item)(
            state,
            dispatch
          );

          if (todoSplitResult) {
            return true; // Successfully split
          }
        }

        const splitResult = splitListItem(schema.nodes.list_item)(
          state,
          dispatch
        );

        if (splitResult) {
          return true; // Successfully split
        }
      } else {
        console.warn("Selection is not at the end of the list item.");
      }
    } else {
      console.warn("Not a list item.");
    }

    // Default behavior if not inside a list item
    return false;
  },
  "Mod-[": liftListItem(schema.nodes.list_item),
  "Mod-]": sinkListItem(schema.nodes.list_item),
  "Shift-Ctrl-0": setBlockType(schema.nodes.paragraph),
  "Shift-Ctrl-\\": setBlockType(schema.nodes.code_block),
  "Shift-Ctrl-1": setBlockType(schema.nodes.heading, { level: 1 }),
  "Shift-Ctrl-2": setBlockType(schema.nodes.heading, { level: 2 }),
  "Shift-Ctrl-3": setBlockType(schema.nodes.heading, { level: 3 }),
  "Shift-Ctrl-4": setBlockType(schema.nodes.heading, { level: 4 }),
  "Shift-Ctrl-5": setBlockType(schema.nodes.heading, { level: 5 }),
  "Shift-Ctrl-6": setBlockType(schema.nodes.heading, { level: 6 }),
  "Mod-_": insertRule,
  "Ctrl-Shift-10": toggleCheckedList(schema),
  "Ctrl-Shift-C": toggleCheck(schema),
};

Object.keys(baseKeymap).forEach((key: any) => {
  if (keys[key]) {
    keys[key] = chainCommands(keys[key], baseKeymap[key]);
  } else {
    keys[key] = baseKeymap[key];
  }
});

export default keymap(keys);
