import { Request, Response } from "express"
import { Document } from "../models/document.model"
import { DocumentVersion } from "../models/documentVersion.model"
import { asyncHandler } from "../utils/asyncHandler"

export const createDocument = asyncHandler(async (req: Request, res: Response) => {
  const { title, folderId } = req.body
  const document = await Document.create({ title, folderId })
  res.status(201).json(document)
})

export const getDocumentsByFolder = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const documents = await Document.find({
    folderId: req.params.folderId
  }).sort({ createdAt: 1 })

  res.json(documents)
})

export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
  const { title, folderId } = req.body
  const document = await Document.findByIdAndUpdate(
    req.params.id,
    { title, folderId },
    { new: true }
  )
  res.json(document)
})

export const deleteDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params

    await Document.deleteOne({ _id: id })
    await DocumentVersion.deleteMany({ documentId: id })

    res.status(204).send()
  }
)
