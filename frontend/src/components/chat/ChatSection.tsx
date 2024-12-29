import React, { useEffect } from 'react';
import ChatInput from './ChatInput';
import ResponseArea from './ResponseArea';
import { Message } from '../../types/chat';

interface ChatSectionProps {
  sessionId: string;
  messages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
  onFetchReferences: (references: any[]) => void; // New prop for fetching references
}

export default function ChatSection({ sessionId, messages, onUpdateMessages, onFetchReferences }: ChatSectionProps) {
  useEffect(() => {
    const chatContainer = document.querySelector('.overflow-y-auto');
    if (chatContainer) {
      chatContainer.scrollTop = 0;
    }
  }, [sessionId]);

  const fetchBotResponse = async (content: string): Promise<Message> => {
    try {
      const requestBody = {
        message: content,
        session_id: sessionId
      };
  
      const response = await fetch('http://localhost:8000/query/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log(data);
      
      const messageContent = data.response
      console.log(messageContent);
      const metadata = data.metadata.slice(0, 3).map((meta: any) => ({
        date_of_issue: meta['date_of_issue'],
        dept: meta['dept'],
        document_code: meta['document_code'],
        section_summary: meta['section_summary'],
        pdf_filename: meta['pdf_filename'],
        pdf_link: meta['pdf_link'],
        status: meta['status'],
        title: meta['title'],
        collection_name: meta['collection name'],
        id: meta['id'],
      }));
  
      // Pass the references to the parent component
      onFetchReferences(metadata);
  
      return {
        id: Date.now().toString(),
        content: messageContent,
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata,
      };
    } catch (error) {
      console.error('Error fetching bot response:', error);
  
      return {
        id: Date.now().toString(),
        content: 'Sorry, something went wrong.',
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata: {
          date_of_issue: '',
          dept: '',
          document_code: '',
          section_summary: '',
        },
      };
    }
  };
  
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    onUpdateMessages([...messages, userMessage]);

    const botResponse = await fetchBotResponse(content);
    onUpdateMessages([...messages, userMessage, botResponse]);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-teal-100">
      <div className="flex-1 overflow-hidden">
        <ResponseArea messages={messages} />
      </div>
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
