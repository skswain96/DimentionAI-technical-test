// PMMenuBar.tsx
import { EditorView } from "prosemirror-view";
import {
  toggleMark,
  setBlockType,
  // wrapIn,
  Command,
} from "prosemirror-commands";
import { schema } from "prosemirror-markdown";
import { wrapInList, liftListItem } from "prosemirror-schema-list";

// import { extendedSchema } from "./schema";

import {
  BoldIcon,
  ItalicIcon,
  HeadingOneIcon,
  BulletListIcon,
  OrderedListIcon,
  LinkIcon,
  CodeIcon,
} from "@/public/icons";

type IPMMenuItem = {
  command: Command;
  icon: JSX.Element;
};

// Link toggle command setup
const toggleLink: IPMMenuItem = {
  command: (state: any, dispatch: any) => {
    const { from, to } = state.selection;
    const linkMark = schema.marks.link;

    if (
      linkMark.isInSet(
        state.storedMarks || state.doc.rangeHasMark(from, to, linkMark)
      )
    ) {
      if (dispatch) dispatch(state.tr.removeMark(from, to, linkMark));
      return true;
    }

    const href = prompt("Enter URL:");

    if (href) {
      const mark = linkMark.create({ href });
      if (dispatch) dispatch(state.tr.addMark(from, to, mark).scrollIntoView());
    }
    return true;
  },
  icon: <LinkIcon />,
};

const toggleHeadingLevel = (level: number) =>
  setBlockType(schema.nodes.heading, { level });

// Define bullet list command
const toggleBulletList: IPMMenuItem = {
  command: (state: any, dispatch: any) => {
    const canWrap = wrapInList(schema.nodes.bullet_list)(state, dispatch);
    if (!canWrap) {
      console.warn("Cannot wrap selection in bullet list.");
    }

    return canWrap;
  },
  icon: <BulletListIcon />,
};

// Define ordered list command
const toggleOrderedList: IPMMenuItem = {
  command: (state: any, dispatch: any) => {
    const canWrap = wrapInList(schema.nodes.ordered_list)(state, dispatch);

    if (!canWrap) {
      console.warn("Cannot wrap selection in ordered list.");
    }

    return canWrap;
  },
  icon: <OrderedListIcon />,
};

const menuItemsData: IPMMenuItem[] = [
  { command: toggleHeadingLevel(1), icon: <HeadingOneIcon /> },
  { command: toggleMark(schema.marks.strong), icon: <BoldIcon /> },
  { command: toggleMark(schema.marks.em), icon: <ItalicIcon /> },
  { command: toggleMark(schema.marks.code), icon: <CodeIcon /> },
  toggleLink,
  toggleOrderedList,
  toggleBulletList,
];

const PMMenuBar: React.FC<{ editorView: EditorView }> = ({ editorView }) => {
  return (
    <div className="inline-flex items-center space-x-3">
      {menuItemsData.map(({ command, icon }, index) => (
        <button
          key={index}
          onClick={() => {
            command(editorView.state, editorView.dispatch);
            editorView.focus();
          }}
          className="h-[24px] w-[24px] inline-flex items-center justify-center text-[#6C6F75]"
          aria-label={`Toolbar action ${index}`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export { PMMenuBar, toggleBulletList, toggleOrderedList };
