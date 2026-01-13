import { Router } from "express"
import {
  saveDocumentVersion,
  getLatestVersion,
  getAllVersions,
  getVersionByNumber,
  rollbackToVersion
} from "../controllers/version.controller"

const router = Router()

router.post("/:id/save", saveDocumentVersion)
router.get("/:id/latest", getLatestVersion)
router.get("/:id/versions", getAllVersions)
router.get("/:id/versions/:version", getVersionByNumber)
router.post("/:id/rollback/:version", rollbackToVersion)

export default router
