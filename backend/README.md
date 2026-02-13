# Chat System Backend

A multi-turn conversational AI chat system with image upload and streaming support.

## Features

✓ Multi-turn conversations with context management
✓ Conversation history (view and resume past chats)
✓ Image upload support (up to 5 images, 5MB each)
✓ Vision-capable AI integration ready
✓ Streaming responses (Server-Sent Events)
✓ Comprehensive error handling
✓ MongoDB persistence

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on the port specified in your `.env.local` file.

## Project Structure

```
backend/
├── config/
│   ├── config.js          # Environment configuration
│   └── upload.js          # Multer file upload config
├── controllers/
│   ├── conversation.controller.js
│   └── message.controller.js
├── db/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── errorHandler.js    # Error handling middleware
├── models/
│   ├── User.model.js
│   ├── Conversation.model.js
│   └── Message.model.js
├── routes/
│   ├── conversation.routes.js
│   └── message.routes.js
├── services/
│   └── ai.service.js      # AI/LLM integration (mock - needs real API)
└── server.js
```

## API Endpoints

### Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/user/:userId` - Get user's conversations
- `GET /api/conversations/:conversationId` - Get conversation details
- `PUT /api/conversations/:conversationId` - Update conversation (e.g., title)
- `DELETE /api/conversations/:conversationId` - Delete conversation
- `GET /api/conversations/:conversationId/messages` - Get conversation messages

### Messages
- `POST /api/messages` - Send message (supports file upload, returns SSE stream)
- `GET /api/messages/:messageId` - Get message by ID
- `DELETE /api/messages/:messageId` - Delete message

## Next Steps

1. **Integrate real LLM API** in `services/ai.service.js`:
   - OpenAI (GPT-4 Vision)
   - Anthropic (Claude)
   - Google (Gemini)

2. **Add authentication** (JWT or session-based)

3. **Test the endpoints** using curl or Postman

## Example Usage

```bash
# Create a conversation
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","title":"My Chat"}'

# Send a message with streaming response
curl -X POST http://localhost:3000/api/messages \
  -F "conversationId=CONV_ID" \
  -F "content=Hello!" \
  -F "images=@image.jpg"
```
