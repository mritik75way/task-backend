import { Schema, model } from "mongoose"

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null
    }
  },
  {
    timestamps: true
  }
)

export const Folder = model("Folder", folderSchema)
