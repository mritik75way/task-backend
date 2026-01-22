import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { files } from "../fileStore";

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).end();

  const record = {
    id: crypto.randomUUID(),
    originalName: req.file.originalname,
    storedName: req.file.filename,
    folderId: req.body.folderId,
  };

  files.push(record);

  res.json(record);
});

export default router;
    