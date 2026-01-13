import { Schema, model } from "mongoose"

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Document = model("Document", documentSchema)
