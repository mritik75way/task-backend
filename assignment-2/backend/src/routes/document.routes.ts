import { Router } from "express"
import {
  createDocument,
  getDocumentsByFolder,
  updateDocument,
  deleteDocument
} from "../controllers/document.controller"

const router = Router()

router.post("/", createDocument)
router.get("/folder/:folderId", getDocumentsByFolder)
router.put("/:id", updateDocument)
router.delete("/:id", deleteDocument)

export default router
