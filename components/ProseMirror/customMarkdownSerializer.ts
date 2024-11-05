// customMarkdownSerializer.ts
import {
  MarkdownSerializer,
  MarkdownSerializerState,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { Node } from "prosemirror-model";

export const customMarkdownSerializer = new MarkdownSerializer(
  {
    ...defaultMarkdownSerializer.nodes,
    // Serialize todo_item as Markdown checklist item
    todo_item(state: MarkdownSerializerState, node: Node) {
      const checked = node.attrs.done ? "x" : " ";
      state.write(`- [${checked}] `);
      state.renderInline(node);
      state.closeBlock(node);
    },
    // Serialize todo_list as unordered list
    todo_list(state: MarkdownSerializerState, node: Node) {
      state.renderList(node, "  ", () => "- ");
    },
  },
  defaultMarkdownSerializer.marks // Keep default marks serialization
);
