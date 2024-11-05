// PMEditor.tsx
import React, { useState, useRef, useEffect } from "react";

import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";

import { Plugin, EditorState, Transaction } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
import { history } from "prosemirror-history";

import { extendedSchema as schema } from "./schema";
import keys from "./keys";
import inputRules from "./rules";
import { customMarkdownSerializer } from "./customMarkdownSerializer";

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

  function handleClickOn(
    editorView: any,
    pos: any,
    node: any,
    nodePos: any,
    event: any
  ) {
    if (event.target.className === "todo-checkbox") {
      editorView.dispatch(
        toggleTodoItemAction(editorView.state, nodePos, node)
      );
      return true;
    }
  }

  function toggleTodoItemAction(state: any, pos: any, todoItemNode: any) {
    return state.tr.setNodeMarkup(pos, todoItemNode.type, {
      done: !todoItemNode.attrs.done,
    });
  }

  useEffect(() => {
    handleMarkdownValue(markdown);
  }, [markdown]);

  useEffect(() => {
    const editorView = new EditorView(editorRef.current!, {
      state: EditorState.create({
        plugins: [keys, inputRules, history(), PlaceholderPlugin],
        schema,
      }),
      dispatchTransaction: (transaction: Transaction) => {
        const docChanged = transaction.docChanged;
        const state = editorView.state.apply(transaction);
        if (docChanged) {
          const markdown = customMarkdownSerializer.serialize(state.doc);
          setMarkdown(markdown);
        }
        editorView.updateState(state);
      },
      handleClickOn,
    });

    setEditorView(editorView);
    setMarkdown(defaultMarkdownSerializer.serialize(editorView.state.doc));

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
