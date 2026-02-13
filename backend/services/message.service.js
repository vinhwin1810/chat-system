import { Message } from "../models/Message.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { streamChatCompletion } from "./ai.service.js";

/**
 * Determine file type from mimetype
 */
const getFileType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("text/")) return "text";
  if (mimetype.includes("pdf")) return "document";
  if (
    mimetype.includes("word") ||
    mimetype.includes("document") ||
    mimetype.includes("msword")
  )
    return "document";
  if (
    mimetype.includes("excel") ||
    mimetype.includes("spreadsheet") ||
    mimetype.includes("ms-excel")
  )
    return "spreadsheet";
  return "other";
};

/**
 * Process uploaded files (separates images from text/documents)
 */
export const processUploadedFiles = (files) => {
  if (!files || files.length === 0) return { images: [], attachments: [] };

  const images = [];
  const attachments = [];

  files.forEach((file) => {
    const fileData = {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    if (file.mimetype.startsWith("image/")) {
      // Image file
      images.push({
        url: fileData.url,
        filename: fileData.filename,
        mimetype: fileData.mimetype,
        size: fileData.size,
      });
    } else {
      // Text/document file
      attachments.push({
        ...fileData,
        type: getFileType(file.mimetype),
      });
    }
  });

  return { images, attachments };
};

/**
 * Process uploaded images (deprecated - use processUploadedFiles instead)
 */
export const processUploadedImages = (files) => {
  if (!files || files.length === 0) return [];

  return files
    .filter((file) => file.mimetype.startsWith("image/"))
    .map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    }));
};

/**
 * Save user message
 */
export const saveUserMessage = async ({
  conversationId,
  userId,
  content,
  role = "user",
  images = [],
  attachments = [],
}) => {
  // Verify conversation exists and user owns it
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw {
      statusCode: 404,
      message: "Conversation not found",
    };
  }

  if (conversation.userId.toString() !== userId) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  // Create user message
  const userMessage = await Message.create({
    conversationId,
    role,
    content,
    images,
    attachments,
  });

  // Update conversation's lastMessageAt
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: new Date(),
  });

  return userMessage;
};

/**
 * Get conversation history for AI context
 */
export const getConversationHistory = async (conversationId, limit = 10) => {
  const history = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return history.reverse().map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};

/**
 * Create initial assistant message
 */
export const createAssistantMessage = async (conversationId) => {
  const assistantMessage = await Message.create({
    conversationId,
    role: "assistant",
    content: "",
  });

  return assistantMessage;
};

/**
 * Update assistant message with content
 */
export const updateAssistantMessage = async (messageId, content, metadata = {}) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw {
      statusCode: 404,
      message: "Message not found",
    };
  }

  message.content = content;
  message.metadata = { ...message.metadata, ...metadata };
  await message.save();

  return message;
};

/**
 * Stream AI response
 */
export const streamAIResponse = async (
  contextMessages,
  images = [],
  attachments = []
) => {
  return streamChatCompletion(contextMessages, images, attachments);
};

/**
 * Get message by ID
 */
export const getMessageById = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw {
      statusCode: 404,
      message: "Message not found",
    };
  }

  // Verify user owns the conversation this message belongs to
  const conversation = await Conversation.findById(message.conversationId);

  if (!conversation || conversation.userId.toString() !== userId) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  return message;
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw {
      statusCode: 404,
      message: "Message not found",
    };
  }

  // Verify user owns the conversation this message belongs to
  const conversation = await Conversation.findById(message.conversationId);

  if (!conversation || conversation.userId.toString() !== userId) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  await Message.findByIdAndDelete(messageId);

  return { message: "Message deleted successfully" };
};
