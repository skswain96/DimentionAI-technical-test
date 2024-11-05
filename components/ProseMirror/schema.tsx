// Schema.tsx

import { Schema } from "prosemirror-model";
import { schema as baseSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";

// Define the to-do item and to-do list node specs
const todoItemSpec: any = {
  attrs: { done: { default: false } },
  content: "paragraph block*",
  toDOM(node: any) {
    return [
      "li",
      { "data-type": "todo_item", "data-done": node.attrs.done.toString() },
      ["span", { class: "todo-checkbox", contenteditable: "false" }],
      ["div", { class: "todo-content" }, 0],
    ];
  },
  parseDOM: [
    {
      tag: '[data-type="todo_item"]',
      getAttrs: (dom: any) => ({
        done: dom.getAttribute("data-done") === "true",
      }),
    },
  ],
};

const todoListSpec: any = {
  group: "block",
  content: "todo_item+",
  toDOM() {
    return ["ul", { "data-type": "todo_list" }, 0];
  },
  parseDOM: [{ tag: '[data-type="todo_list"]' }],
};

// Extend the schema with checklist nodes
const nodes: any = addListNodes(
  baseSchema.spec.nodes,
  "paragraph block*",
  "block"
).append({
  todo_item: todoItemSpec,
  todo_list: todoListSpec,
});

const marks = baseSchema.spec.marks;

export const extendedSchema = new Schema({
  nodes,
  marks,
});
