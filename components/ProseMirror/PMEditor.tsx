// PMEditor.tsx
import React, { useState, useRef, useEffect } from "react";

import {
  // schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";

import { Plugin, EditorState, Transaction } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
// import { baseKeymap, chainCommands } from "prosemirror-commands";
import { history } from "prosemirror-history";

import { extendedSchema } from "./schema";
import keys from "./keys";
import inputRules from "./rules";

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
          keys,
          // keymap(listKeymap),
          // keymap(baseKeymap),
          inputRules,
          history(),
          PlaceholderPlugin,
        ],
        schema: extendedSchema,
      }),
      dispatchTransaction: (transaction: Transaction) => {
        console.log("transaction works", transaction);
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
    </React.Fragment>
  );
};
