import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { conversationsAPI } from '../api/conversations';
import { streamMessage } from '../api/messages';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';

const Chat = () => {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation._id);
    }
  }, [currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const data = await conversationsAPI.getAll();
      setConversations(data);
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await conversationsAPI.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const newConv = await conversationsAPI.create({ title: 'New Chat' });
      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await conversationsAPI.delete(id);
      const updatedConvs = conversations.filter((c) => c._id !== id);
      setConversations(updatedConvs);
      if (currentConversation?._id === id) {
        setCurrentConversation(updatedConvs[0] || null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const sendMessage = async (content, files) => {
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    setLoading(true);

    const userMessage = {
      _id: Date.now(),
      role: 'user',
      content,
      createdAt: new Date(),
      images: [],
      attachments: [],
    };
    setMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    formData.append('conversationId', currentConversation._id);
    formData.append('content', content);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('images', file);
      });
    }

    const assistantMessageId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      {
        _id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        streaming: true,
      },
    ]);

    try {
      await streamMessage(
        formData,
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        (message) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === assistantMessageId
                ? { ...message, streaming: false }
                : msg
            )
          );
          setLoading(false);
          loadConversations();
        },
        (error) => {
          console.error('Streaming error:', error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === assistantMessageId
                ? {
                    ...msg,
                    content: 'Sorry, an error occurred. Please try again.',
                    streaming: false,
                  }
                : msg
            )
          );
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={setCurrentConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        onLogout={logout}
        user={user}
      />

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold text-dark-text mb-2">How can I help you today?</h2>
              <p className="text-dark-text-secondary">Start a new conversation</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-8">
              {messages.map((message) => (
                <ChatMessage key={message._id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default Chat;
