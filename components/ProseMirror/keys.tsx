import { keymap } from "prosemirror-keymap";
import { undoInputRule } from "prosemirror-inputrules";
import { undo, redo } from "prosemirror-history";
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem,
} from "prosemirror-schema-list";
import { schema } from "prosemirror-markdown";
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
  //   Enter: splitListItem(schema.nodes.list_item),
  Enter: (state: any, dispatch: any) => {
    const { $from } = state.selection;
    const depth = $from.depth;

    // Check the current node and its parent structure
    const listItem = $from.node(depth);
    const parentNode = $from.node(depth - 1);

    if (parentNode.type.name === schema.nodes.list_item.name) {
      // Check if selection is at the end of the list item
      if ($from.parentOffset === listItem.content.size) {
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
