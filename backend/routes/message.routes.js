import express from "express";
import {
  sendMessage,
  getMessageById,
  deleteMessage,
} from "../controllers/message.controller.js";
import { upload } from "../config/upload.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All message routes require authentication
router.use(authenticate);

// Message routes
router.post("/", upload.array("images", 5), sendMessage);
router.get("/:messageId", getMessageById);
router.delete("/:messageId", deleteMessage);

export default router;
