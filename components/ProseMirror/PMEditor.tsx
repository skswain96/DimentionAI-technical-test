// PMEditor.tsx
import React, { useState, useRef, useEffect } from "react";

import {
  // schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem,
} from "prosemirror-schema-list";

import { Plugin, EditorState, Transaction } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { history, redo, undo } from "prosemirror-history";

import { extendedSchema } from "./schema";
// import { toggleBulletList, toggleOrderedList } from "./PMMenuBar";

const PlaceholderPlugin = new Plugin({
  props: {
    decorations(state) {
      const decorations: any = [];
      const { doc, selection } = state;

      doc.descendants((node, pos) => {
        if (!node.isBlock || !!node.textContent) return;
        if (selection.empty && selection.from === pos + 1) {
          // The selection is inside the node
          if (node.type.name === "paragraph" && doc.childCount === 1) {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: "placeholder",
                style: "--placeholder-text: 'Describe this task';",
              })
            );
          }
        }
        return false;
      });

      return DecorationSet.create(doc, decorations);
    },
  },
});

const initialContent = ``;

baseKeymap["Mod-z"] = undo;
baseKeymap["Mod-y"] = redo;

// const listKeymap = {
//   // "Ctrl-Shift-8": (state: any, dispatch: any) => {
//   //   return toggleBulletList.command(state, dispatch);
//   // },
//   // "Ctrl-Shift-9": (state: any, dispatch: any) => {
//   //   return toggleOrderedList.command(state, dispatch);
//   // },
//   "Ctrl-Shift-8": wrapInList(schema.nodes.bullet_list),
//   "Ctrl-Shift-9": wrapInList(schema.nodes.ordered_list),
//   "Shift-Ctrl-8": wrapInList(schema.nodes.bullet_list),
//   "Shift-Ctrl-9": wrapInList(schema.nodes.ordered_list),
//   Enter: splitListItem(schema.nodes.list_item),
//   "Mod-[": liftListItem(schema.nodes.list_item),
//   "Mod-]": sinkListItem(schema.nodes.list_item),
// };

const listKeymap = {
  "Ctrl-Shift-8": wrapInList(extendedSchema.nodes.bullet_list),
  "Ctrl-Shift-9": wrapInList(extendedSchema.nodes.ordered_list),
  Enter: splitListItem(extendedSchema.nodes.list_item),
  "Mod-[": liftListItem(extendedSchema.nodes.list_item),
  "Mod-]": sinkListItem(extendedSchema.nodes.list_item),
};

interface PMEditorReactProps {
  handleEditorViewState: (editorView: EditorView | null) => void;
  handleMarkdownValue: (arg: any) => void;
}
export const PMEditorReact: React.FC<PMEditorReactProps> = ({
  handleEditorViewState,
  handleMarkdownValue,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    handleMarkdownValue(markdown);
  }, [markdown]);

  useEffect(() => {
    const editorView = new EditorView(editorRef.current!, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(initialContent),
        plugins: [
          keymap(baseKeymap),
          keymap(listKeymap),
          history(),
          PlaceholderPlugin,
        ],
        schema: extendedSchema,
      }),
      dispatchTransaction: (transaction: Transaction) => {
        const docChanged = transaction.docChanged;
        const state = editorView.state.apply(transaction);
        if (docChanged) {
          const markdown = defaultMarkdownSerializer.serialize(state.doc);
          setMarkdown(markdown);
        }
        editorView.updateState(state);
      },
    });

    setEditorView(editorView);
    setMarkdown(defaultMarkdownSerializer.serialize(editorView.state.doc));

    // editorView.focus();
    return () => {
      editorView.destroy();
    };
  }, [editorRef]);

  useEffect(() => {
    handleEditorViewState(editorView);
  }, [editorView]);

  return (
    <React.Fragment>
      <div className="w-full h-full">
        <div
          ref={editorRef}
          className="w-full min-h-[4.75rem] p-1 text-gray-900"
        />
      </div>
      {/* <div
          style={{
            border: "1px solid black",
            borderRadius: "1rem",
            width: 300,
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <span style={{ padding: "0.5rem" }}>Markdown</span>
          <hr style={{ margin: 0 }} />
          <textarea
            readOnly
            style={{
              flexGrow: 1,
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
            value={markdown}
          />
        </div> */}
    </React.Fragment>
  );
};
