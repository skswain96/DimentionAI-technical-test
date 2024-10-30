//Schema.tsx
import { Schema } from "prosemirror-model";
import { schema as baseSchema } from "prosemirror-markdown";
import { addListNodes } from "prosemirror-schema-list";

const combinedNodes = addListNodes(
  baseSchema.spec.nodes,
  "paragraph block*",
  "block"
);

const marks = baseSchema.spec.marks;

export const extendedSchema = new Schema({
  nodes: combinedNodes,
  marks,
});
