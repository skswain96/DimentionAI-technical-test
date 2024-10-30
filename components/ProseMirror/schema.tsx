//Schema.tsx
import { Schema } from "prosemirror-model";
import { schema as baseSchema } from "prosemirror-markdown";
import { addListNodes } from "prosemirror-schema-list";

const customNodes: any = {
  // Define the checked list node
  checked_list: {
    content: "checked_list_item+",
    group: "block",
    parseDOM: [{ tag: "ul.list-node[data-type='todo_list']" }],
    toDOM: () => ["ul", { class: "list-node", "data-type": "todo_list" }, 0],
  },

  // Define the checked list item node with the custom structure
  checked_list_item: {
    content: "inline*",
    defining: true,
    draggable: false,
    parseDOM: [
      {
        tag: "li[data-type='todo_item']",
        getAttrs: (dom: any) => ({
          done: dom.getAttribute("data-done") === "true",
        }),
      },
    ],
    toDOM: (node: any) => [
      "li",
      { "data-type": "todo_item", "data-done": node.attrs.done },
      [
        "div",
        { class: "todo-checkbox-container" },
        [
          "svg",
          {
            width: "6",
            height: "10",
            viewBox: "0 0 6 10",
            class: "todo-drag-handle",
          },
          [
            "path",
            { fillRule: "evenodd", clipRule: "evenodd", d: "M1 8C1..." },
          ],
        ],
        [
          "div",
          {
            class: node.attrs.done
              ? "todo-checkbox todo-checkbox-checked"
              : "todo-checkbox todo-checkbox-unchecked",
            contenteditable: "false",
          },
        ],
      ],
      [
        "div",
        { class: "todo-content" },
        ["p", { class: "text-node" }, 0], // Placeholder for the text content
      ],
    ],
    attrs: { done: { default: false } }, // Attribute to track checked state
  },
};

const combinedNodes = addListNodes(
  baseSchema.spec.nodes,
  "paragraph block*",
  "block"
).append(customNodes);

const marks = baseSchema.spec.marks;

export const extendedSchema = new Schema({
  nodes: combinedNodes,
  marks,
});
