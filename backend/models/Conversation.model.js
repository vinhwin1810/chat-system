import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Conversation",
      trim: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient querying of user's conversations sorted by last message
conversationSchema.index({ userId: 1, lastMessageAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
