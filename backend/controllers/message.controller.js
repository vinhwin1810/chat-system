import * as messageService from "../services/message.service.js";

// Send a message and get AI response (with streaming)
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, role = "user" } = req.body;
    const userId = req.user.userId;

    if (!conversationId || !content) {
      return res.status(400).json({
        error: "conversationId and content are required",
      });
    }

    // Process uploaded files (separate images from text/documents)
    const { images, attachments } = messageService.processUploadedFiles(
      req.files,
    );

    // Save user message
    await messageService.saveUserMessage({
      conversationId,
      userId,
      content,
      role,
      images,
      attachments,
    });

    // Get conversation history for AI context
    const contextMessages =
      await messageService.getConversationHistory(conversationId);

    // Set up SSE (Server-Sent Events) for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    let assistantMessage;

    try {
      // Create initial assistant message
      assistantMessage =
        await messageService.createAssistantMessage(conversationId);

      // Stream the AI response (prioritize text attachments, then images)
      const stream = await messageService.streamAIResponse(
        contextMessages,
        images,
        attachments,
      );

      for await (const chunk of stream) {
        fullResponse += chunk;

        // Send chunk to client
        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: chunk,
            messageId: assistantMessage._id,
          })}\n\n`,
        );
      }

      // Update the assistant message with full response
      await messageService.updateAssistantMessage(
        assistantMessage._id,
        fullResponse,
      );

      // Send completion event
      res.write(
        `data: ${JSON.stringify({
          type: "done",
          message: {
            ...assistantMessage.toObject(),
            content: fullResponse,
          },
        })}\n\n`,
      );

      res.end();
    } catch (streamError) {
      console.error("Streaming error:", streamError);

      // If assistant message was created, update it with error
      if (assistantMessage) {
        await messageService.updateAssistantMessage(
          assistantMessage._id,
          "Sorry, I encountered an error while processing your request.",
          { error: streamError.message },
        );
      }

      res.write(
        `data: ${JSON.stringify({
          type: "error",
          error: "Failed to generate response",
        })}\n\n`,
      );

      res.end();
    }
  } catch (error) {
    next(error);
  }
};

// Get a single message by ID
export const getMessageById = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await messageService.getMessageById(messageId, userId);

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// Delete a message
export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const result = await messageService.deleteMessage(messageId, userId);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
