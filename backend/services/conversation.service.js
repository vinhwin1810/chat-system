import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";

/**
 * Create a new conversation
 */
export const createConversation = async ({ userId, title }) => {
  if (!userId) {
    throw {
      statusCode: 400,
      message: "userId is required",
    };
  }

  const conversation = await Conversation.create({
    userId,
    title: title || "New Conversation",
  });

  return conversation;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId, { limit = 50, offset = 0 }) => {
  const conversations = await Conversation.find({ userId })
    .sort({ lastMessageAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .lean();

  // Get message count for each conversation
  const conversationsWithCount = await Promise.all(
    conversations.map(async (conv) => {
      const messageCount = await Message.countDocuments({
        conversationId: conv._id,
      });
      return { ...conv, messageCount };
    })
  );

  return conversationsWithCount;
};

/**
 * Get a single conversation by ID
 */
export const getConversationById = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw {
      statusCode: 404,
      message: "Conversation not found",
    };
  }

  // Verify user owns this conversation
  if (conversation.userId.toString() !== userId) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  return conversation;
};

/**
 * Update conversation
 */
export const updateConversation = async (conversationId, userId, { title }) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw {
      statusCode: 404,
      message: "Conversation not found",
    };
  }

  // Verify user owns this conversation
  if (conversation.userId.toString() !== userId) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  conversation.title = title;
  await conversation.save();

  return conversation;
};

/**
 * Delete a conversation and all its messages
 */
export const deleteConversation = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw {
      statusCode: 404,
      message: "Conversation not found",
    };
  }

  // Verify user owns this conversation
  if (conversation.userId.toString() !== userId) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  // Delete conversation
  await Conversation.findByIdAndDelete(conversationId);

  // Delete all messages in this conversation
  await Message.deleteMany({ conversationId });

  return { message: "Conversation deleted successfully" };
};

/**
 * Get messages for a conversation
 */
export const getConversationMessages = async (
  conversationId,
  userId,
  { limit = 50, offset = 0 }
) => {
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

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .lean();

  return messages;
};
