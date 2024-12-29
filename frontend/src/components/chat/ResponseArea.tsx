import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '../../types/chat';

interface ResponseAreaProps {
  messages: Message[];
}

export default function ResponseArea({ messages = [] }: ResponseAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef(true); // To track if the user is at the bottom

  // Detect if the user is scrolled to the bottom or not
  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      isScrolledToBottom.current =
        chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Scroll to the bottom when new messages are added, unless the user has scrolled up
  useEffect(() => {
    if (isScrolledToBottom.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={chatContainerRef} style={{ maxHeight: '80vh' }}>
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>Send a message to start the conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {/* This div is used to scroll the container to the bottom */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
