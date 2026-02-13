import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
        mimetype: String,
        size: Number,
      },
    ],
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
        originalName: String,
        mimetype: String,
        size: Number,
        type: {
          type: String,
          enum: ["text", "document", "spreadsheet", "other"],
          default: "other",
        },
      },
    ],
    metadata: {
      model: String,
      tokens: Number,
      finishReason: String,
      error: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of messages in a conversation
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
