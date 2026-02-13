# Chat System Frontend

A modern, ChatGPT-style interface built with React, Tailwind CSS, and Vite.

## Features

✅ JWT Authentication (Login/Register)
✅ Real-time streaming chat responses
✅ Multi-turn conversations with context
✅ Conversation history sidebar
✅ Image & text file uploads
✅ Responsive design (mobile-friendly)
✅ Purple gradient theme

## Tech Stack

- **React** 19.2 - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Project Structure

```
src/
├── api/                 # API service layer
│   ├── axios.js        # Axios instance with interceptors
│   ├── auth.js         # Authentication API calls
│   ├── conversations.js # Conversation API calls
│   └── messages.js     # Message API calls (with SSE streaming)
├── components/         # Reusable components
│   ├── ChatInput.jsx   # Message input with file upload
│   ├── ChatMessage.jsx # Message display component
│   └── Sidebar.jsx     # Conversation list sidebar
├── context/           # React Context
│   └── AuthContext.jsx # Authentication state management
├── pages/             # Page components
│   ├── Login.jsx      # Login page
│   ├── Register.jsx   # Registration page
│   └── Chat.jsx       # Main chat interface
├── App.jsx            # Root component with routing
├── main.jsx           # Entry point
└── index.css          # Global styles + Tailwind imports
```

## Features

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Auto-redirect protected routes
- Automatic token injection in API calls

### Chat Interface
- Sidebar with conversation list
- Real-time message streaming (SSE)
- Support for multiple file types
- Auto-scroll to latest message
- Typing indicator during streaming

### Styling
- **Tailwind CSS** for all component styling
- Minimal custom CSS for global styles
- Purple gradient theme
- Fully responsive design

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Environment Variables

`.env` file:
```
VITE_API_URL=http://localhost:5500
```
