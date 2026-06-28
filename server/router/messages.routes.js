import { Router } from "express";
import { verfiyToken } from "../middlewares/auth.middleware.js";
import {
  getAllMessages,
  uplaodFiles,
} from "../controllers/messages.controllers.js";
import multer from "multer";

const messagesRouter = Router();

const upload = multer({ dest: "uploads/file" });

messagesRouter.post("/get-messages", verfiyToken, getAllMessages);
messagesRouter.post(
  "/upload-files",
  verfiyToken,
  upload.single("file"),
  uplaodFiles,
);

export default messagesRouter;
