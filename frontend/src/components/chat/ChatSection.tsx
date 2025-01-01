import React, { useEffect } from 'react';
import ChatInput from './ChatInput';
import ResponseArea from './ResponseArea';
import { Message } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';

interface ChatSectionProps {
  sessionId: string;
  messages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
  onFetchReferences: (references: any[]) => void; // New prop for fetching references
}

// export default function ChatSection({ sessionId, messages, onUpdateMessages, onFetchReferences }: ChatSectionProps) {
//   useEffect(() => {
//     const chatContainer = document.querySelector('.overflow-y-auto');
//     if (chatContainer) {
//       chatContainer.scrollTop = 0;
//     }
//   }, [sessionId]);
//   const { user } = useAuth();
//   const fetchBotResponse = async (content: string): Promise<Message> => {
//     try {
//       const requestBody = {
//         message: content,
//         session_id: sessionId,
//         username : user?.username
//       };
  
//       const response = await fetch('http://localhost:8000/query/query', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });
  
//       const data = await response.json();
//       console.log(data);
      
//       const messageContent = data.response
//       console.log(messageContent);
//       const metadata = data.metadata.slice(0, 3).map((meta: any) => ({
//         date_of_issue: meta['date_of_issue'],
//         dept: meta['dept'],
//         document_code: meta['document_code'],
//         section_summary: meta['section_summary'],
//         pdf_filename: meta['pdf_filename'],
//         pdf_link: meta['pdf_link'],
//         status: meta['status'],
//         title: meta['title'],
//         collection_name: meta['collection name'],
//         id: meta['id'],
//       }));
  
//       // Pass the references to the parent component
//       onFetchReferences(metadata);
  
//       return {
//         id: Date.now().toString(),
//         content: messageContent,
//         isUser: false,
//         timestamp: new Date().toISOString(),
//         metadata,
//       };
//     } catch (error) {
//       console.error('Error fetching bot response:', error);
  
//       return {
//         id: Date.now().toString(),
//         content: 'Sorry, something went wrong.',
//         isUser: false,
//         timestamp: new Date().toISOString(),
//         metadata: {
//           date_of_issue: '',
//           dept: '',
//           document_code: '',
//           section_summary: '',
//         },
//       };
//     }
//   };
  
//   const handleSendMessage = async (content: string) => {
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content,
//       isUser: true,
//       timestamp: new Date().toISOString(),
//     };

//     onUpdateMessages([...messages, userMessage]);

//     const botResponse = await fetchBotResponse(content);
//     onUpdateMessages([...messages, userMessage, botResponse]);
//   };

//   return (
//     <div className="flex-1 flex flex-col min-w-0 border-r border-teal-100">
//       <div className="flex-1 overflow-hidden">
//         <ResponseArea messages={messages} />
//       </div>
//       <div className="flex-shrink-0">
//         <ChatInput onSendMessage={handleSendMessage} />
//       </div>
//     </div>
//   );
// }

export default function ChatMessage({ message }: { message: Message }) {
  const { query, isUser, content, timestamp, metadata } = message;

  // Helper to process text with bold markers
  const processBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Helper to render formatted content
  const renderFormattedContent = (content: string) => {
    return (
      <div className="space-y-4">
        {content.split('\n').map((line, index) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={index} className="text-lg font-bold text-teal-600 mt-4">
                {line.replace('### ', '')}
              </h3>
            );
          } else if (line.match(/^\d+\./)) {
            return (
              <p key={index} className="ml-4 text-gray-700">
                {processBoldText(line)}
              </p>
            );
          } else if (line.startsWith('- ')) {
            const textAfterDash = line.slice(2);
            return (
              <p key={index} className="ml-6 text-gray-700">
                - {processBoldText(textAfterDash)}
              </p>
            );
          } else {
            return (
              <p key={index} className="text-sm text-gray-800">
                {processBoldText(line)}
              </p>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Icon */}
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isUser ? 'bg-teal-600' : 'bg-teal-100'
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-teal-600" />
          )}
        </div>
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] space-y-2 ${
          isUser ? 'items-end text-white' : 'items-start'
        }`}
      >
        {/* Display Query and Answer Consistently */}
        <div
          className={`p-4 rounded-2xl ${
            isUser ? 'bg-teal-600 text-white ml-auto' : 'bg-teal-50 text-gray-800'
          }`}
        >
          {/* Display query from the user with the same styling as the bot's response */}
          {query && isUser && (
            <div
              className="mb-2 text-sm font-semibold text-white"
            >
              <strong>Query:</strong> {query}
            </div>
          )}
          {/* Content (answer from bot) */}
          <div>{renderFormattedContent(content)}</div>
        </div>

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <div className="p-4 rounded-2xl bg-gray-100 text-gray-800">
            <h3 className="font-semibold text-teal-600 mb-2">Related Documents:</h3>
            {metadata.slice(0, 3).map((meta, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold">Metadata {index + 1}:</h4>
                <p>
                  Title: <span className="text-gray-700">{meta.title}</span>
                </p>
                <p>
                  Date of Issue: <span className="text-gray-700">{meta.date_of_issue}</span>
                </p>
                <p>
                  Dept: <span className="text-gray-700">{meta.dept}</span>
                </p>
                <p>
                  Document Code: <span className="text-gray-700">{meta.document_code}</span>
                </p>
                <p>
                  Summary: <span className="text-gray-700">{meta.section_summary}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-gray-500 px-2">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
