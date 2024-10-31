// PMMenuBar.tsx
import { useMemo, useRef, useState } from "react";
import { EditorView } from "prosemirror-view";
// @ts-ignore
import { toggleMark, setBlockType, Command } from "prosemirror-commands";
import { schema } from "prosemirror-markdown";
import { wrapInList, liftListItem } from "prosemirror-schema-list";
import Picker from "@emoji-mart/react";

import { OutsideAlerter } from "@/components/Action/OutsideAlerter";

import {
  BoldIcon,
  ItalicIcon,
  HeadingOneIcon,
  BulletListIcon,
  OrderedListIcon,
  CheckedListIcon,
  LinkIcon,
  CodeIcon,
  AttachmentIcon,
  EmojiIcon,
  ReferIcon,
} from "@/public/icons";

type IPMMenuItem = {
  command: Command;
  icon: JSX.Element;
};

// Emoji Picker command
const insertEmoji = (
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>
) => ({
  command: (state: any, dispatch: any) => {
    setShowEmojiPicker((prev) => !prev); // Toggle emoji picker visibility
    return true;
  },
  icon: <EmojiIcon />,
});

// insert image
const insertAttachment = (fileInputRef: React.RefObject<HTMLInputElement>) => ({
  command: (state: any, dispatch: any) => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file picker when AttachmentIcon is clicked
    }
    return true;
  },
  icon: <AttachmentIcon />,
});

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

const toggleHeadingLevel = (level: number) => (state: any, dispatch: any) => {
  const isHeading = state.selection.$from.parent.hasMarkup(
    schema.nodes.heading,
    { level }
  );

  if (isHeading) {
    // If it's already a heading, reset it to a paragraph
    return setBlockType(schema.nodes.paragraph)(state, dispatch);
  }

  // Otherwise, apply the heading
  return setBlockType(schema.nodes.heading, { level })(state, dispatch);
};

// check if its a list
function isInListItem($from: any) {
  // Traverse up the parent nodes to find a list item
  for (let depth = $from.depth; depth > 0; depth--) {
    const parentNode = $from.node(depth);
    if (parentNode.type === schema.nodes.list_item) {
      return true; // We found a list item
    }
  }
  return false; // No list item found
}

// Define bullet list command
const toggleBulletList: IPMMenuItem = {
  command: (state: any, dispatch: any) => {
    const { $from } = state.selection;

    // Check if the selection is in a bullet list item
    const inBulletList = isInListItem($from);

    if (inBulletList) {
      // If currently in a bullet list item, lift it out
      return liftListItem(schema.nodes.list_item)(state, dispatch);
    } else {
      // Otherwise, try to wrap the selection in a bullet list
      const canWrap = wrapInList(schema.nodes.bullet_list)(state, dispatch);
      if (!canWrap) {
        console.warn("Cannot wrap selection in bullet list.");
      }
      return canWrap;
    }
  },
  icon: <BulletListIcon />,
};

// Define ordered list command
const toggleOrderedList: IPMMenuItem = {
  command: (state: any, dispatch: any) => {
    const { $from } = state.selection;

    // Check if the selection is in an ordered list item
    const inOrderedList = isInListItem($from);

    if (inOrderedList) {
      // If currently in an ordered list item, lift it out
      return liftListItem(schema.nodes.list_item)(state, dispatch);
    } else {
      // Otherwise, try to wrap the selection in an ordered list
      const canWrap = wrapInList(schema.nodes.ordered_list)(state, dispatch);
      if (!canWrap) {
        console.warn("Cannot wrap selection in ordered list.");
      }
      return canWrap;
    }
  },
  icon: <OrderedListIcon />,
};

// Define checked list toggle command
const toggleCheckedList: IPMMenuItem = {
  command: (state: any, dispatch: any) => {
    const { from, $from } = state.selection;
    const node = $from.node(-1);

    if (node.type === schema.nodes.checked_list_item) {
      // If already in a checked list item, toggle the `done` attribute
      if (dispatch) {
        dispatch(
          state.tr.setNodeMarkup($from.pos, null, {
            ...node.attrs,
            done: !node.attrs.done,
          })
        );
      }
      return true;
    } else {
      // Wrap in checked_list if not already in one
      return wrapInList(schema.nodes.checked_list)(state, dispatch);
    }
  },
  icon: <CheckedListIcon />, // Replace with an appropriate icon for checked list
};

const PMMenuBar: React.FC<{ editorView: EditorView }> = ({ editorView }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItemsData: IPMMenuItem[] = useMemo(
    () => [
      insertAttachment(fileInputRef),
      { command: () => null, icon: <ReferIcon /> },
      insertEmoji(setShowEmojiPicker),
      { command: toggleHeadingLevel(1), icon: <HeadingOneIcon /> },
      { command: toggleMark(schema.marks.strong), icon: <BoldIcon /> },
      { command: toggleMark(schema.marks.em), icon: <ItalicIcon /> },
      { command: toggleMark(schema.marks.code), icon: <CodeIcon /> },
      toggleLink,
      toggleOrderedList,
      toggleBulletList,
      toggleCheckedList,
    ],
    []
  );

  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    const emojiNode = schema.text(emoji.native);
    const transaction = editorView.state.tr.replaceSelectionWith(emojiNode);
    editorView.dispatch(transaction.scrollIntoView());
    editorView.focus();
    setShowEmojiPicker(false);
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          const imageNode = schema.nodes.image.create({ src: reader.result });
          const transaction =
            editorView.state.tr.replaceSelectionWith(imageNode);
          editorView.dispatch(transaction.scrollIntoView());
          editorView.focus();
        }
      };
      reader.readAsDataURL(file); // Convert file to data URL
    }
  };

  return (
    <div className="relative inline-flex items-center space-x-3">
      {menuItemsData.map(({ command, icon }, index) => (
        <button
          key={index}
          onClick={() => {
            if (index !== menuItemsData?.length - 1 && index !== 1) {
              command(editorView.state, editorView.dispatch);
              editorView.focus();
            }
          }}
          className={`h-[24px] w-[24px] inline-flex items-center justify-center text-[#6C6F75] hover:bg-gray-100 rounded-full ${
            index !== menuItemsData?.length - 1 && index !== 1
              ? "cursor-pointer"
              : "cursor-not-allowed"
          }`}
          aria-label={`Toolbar action ${index}`}
        >
          {icon}
        </button>
      ))}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {showEmojiPicker && (
        <div id="emoji-container" className="absolute top-[2em]">
          <OutsideAlerter
            handleOutsideClick={() => {
              setShowEmojiPicker(false);
            }}
          >
            <Picker onEmojiSelect={handleEmojiSelect} previewPosition="none" />
          </OutsideAlerter>
        </div>
      )}
    </div>
  );
};

export { PMMenuBar };
