import { Router } from "express";
import fs from "fs";
import path from "path";
import { files } from "../fileStore";

const router = Router();

router.get("/", (req, res) => {
  const folderId = String(req.query.folderId);
  res.json(files.filter(f => f.folderId === folderId));
});

router.delete("/:id", (req, res) => {
  const index = files.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).end();

  const file = files[index];
  const filePath = path.join("uploads", file.storedName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  files.splice(index, 1);
  res.status(204).end();
});

router.get("/all", (_, res) => {
  res.json(files);
});


export default router;
