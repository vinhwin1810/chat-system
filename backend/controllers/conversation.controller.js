import * as conversationService from "../services/conversation.service.js";

// Create a new conversation
export const createConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    const conversation = await conversationService.createConversation({
      userId,
      title,
    });

    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

// Get all conversations for the authenticated user
export const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit, offset } = req.query;

    const conversations = await conversationService.getUserConversations(
      userId,
      {
        limit,
        offset,
      },
    );

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// Get a single conversation by ID
export const getConversationById = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const conversation = await conversationService.getConversationById(
      conversationId,
      userId,
    );

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

// Update conversation (e.g., update title)
export const updateConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    const conversation = await conversationService.updateConversation(
      conversationId,
      userId,
      { title },
    );

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

// Delete a conversation and all its messages
export const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const result = await conversationService.deleteConversation(
      conversationId,
      userId,
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get messages for a conversation
export const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    const { limit, offset } = req.query;

    const messages = await conversationService.getConversationMessages(
      conversationId,
      userId,
      { limit, offset },
    );

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
