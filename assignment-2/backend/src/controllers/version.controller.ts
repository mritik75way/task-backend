import { Request, Response } from "express"
import { DocumentVersion } from "../models/documentVersion.model"
import { asyncHandler } from "../utils/asyncHandler"

export const saveDocumentVersion = asyncHandler( async (
  req: Request,
  res: Response
) => {

  const { content } = req.body
  const documentId = req.params.id

  const latest = await DocumentVersion.findOne({ documentId })
    .sort({ version: -1 })
    .limit(1)

  const version = latest ? latest.version + 1 : 1

  const saved = await DocumentVersion.create({
  documentId,
  version,
  content: structuredClone(content)
})

  res.status(201).json(saved)
})

export const getLatestVersion = asyncHandler( async (
  req: Request,
  res: Response
) => {
  const documentId = req.params.id

  const latest = await DocumentVersion.findOne({ documentId })
    .sort({ version: -1 })
    .limit(1)

  res.json(latest)
})

export const getAllVersions = asyncHandler(async (req: Request, res: Response) => {
  const documentId = req.params.id;

  const versions = await DocumentVersion.find({ documentId })
    .select("version createdAt")
    .sort({ version: -1 })
    .lean(); 

  res.json(Array.isArray(versions) ? versions : []);
});


export const getVersionByNumber = asyncHandler( async (
  req: Request,
  res: Response
) => {
  const { id, version } = req.params

  const docVersion = await DocumentVersion.findOne({
    documentId: id,
    version: Number(version)
  })

  res.json(docVersion)
})

export const rollbackToVersion = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { id, version } = req.params

  const target = await DocumentVersion.findOne({
    documentId: id,
    version: Number(version)
  })

  if (!target) {
    return res.status(404).json({ error: "Version not found" })
  }

  const latest = await DocumentVersion.findOne({ documentId: id })
    .sort({ version: -1 })
    .limit(1)

  const newVersion = latest ? latest.version + 1 : 1

  const created = await DocumentVersion.create({
  documentId: id,
  version: newVersion,
  content: structuredClone(target.content)
})

  res.status(201).json(created)
})


