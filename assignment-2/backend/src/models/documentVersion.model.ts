import { Schema, model } from "mongoose"

const documentVersionSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },
    version: {
      type: Number,
      required: true
    },
    content: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const DocumentVersion = model(
  "DocumentVersion",
  documentVersionSchema
)
