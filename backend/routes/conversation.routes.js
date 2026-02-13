import express from "express";
import {
  createConversation,
  getUserConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
  getConversationMessages,
} from "../controllers/conversation.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All conversation routes require authentication
router.use(authenticate);

// Conversation routes
router.post("/", createConversation);
router.get("/", getUserConversations);
router.get("/:conversationId", getConversationById);
router.put("/:conversationId", updateConversation);
router.delete("/:conversationId", deleteConversation);

// Messages in conversation
router.get("/:conversationId/messages", getConversationMessages);

export default router;
