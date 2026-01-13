import { Router } from "express"
import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder
} from "../controllers/folder.controller"

const router = Router()

router.post("/", createFolder)
router.get("/", getFolders)
router.put("/:id", updateFolder)
router.delete("/:id", deleteFolder)

export default router
