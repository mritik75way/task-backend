import { Request, Response } from "express"
import { Folder } from "../models/folder.model"
import { asyncHandler } from "../utils/asyncHandler"

export const createFolder = asyncHandler(  async (req: Request, res: Response) => {
  const { name, parentId } = req.body
  const folder = await Folder.create({ name, parentId: parentId || null })
  res.status(201).json(folder)
})

export const getFolders = asyncHandler(async (_req: Request, res: Response) => {
  const folders = await Folder.find().sort({ createdAt: 1 })
  res.json(folders)
})

export const updateFolder = asyncHandler(async (req: Request, res: Response) => {
  const { name, parentId } = req.body
  const folder = await Folder.findByIdAndUpdate(
    req.params.id,
    { name, parentId },
    { new: true }
  )
  res.json(folder)
})

export const deleteFolder = asyncHandler(async (req: Request, res: Response) => {
  await Folder.findByIdAndDelete(req.params.id)
  res.status(204).send()
})
