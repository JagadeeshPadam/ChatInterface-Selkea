import React from 'react';
import { Bot, User } from 'lucide-react';

type Metadata = {
  title: string;
  date_of_issue: string;
  dept: string;
  document_code: string;
  section_summary: string;
};

type Message = {
  query: string;
  isUser: boolean;
  content: string;
  timestamp: number | string | Date;
  metadata?: Metadata[];
};

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
          // Heading - Text starts with "###"
          if (line.startsWith('### ')) {
            return (
              <h3 key={index} className="text-lg font-bold text-teal-600 mt-4">
                {line.replace('### ', '')}
              </h3>
            );
          } 
          // Numbered List (starts with "1." or "2." etc.)
          else if (line.match(/^\d+\./)) {
            // Process bold text within numbered lines
            return (
              <p key={index} className="ml-4 text-gray-700">
                {processBoldText(line)}
              </p>
            );
          } 
          // Bullet points or dashed lines (starts with "- ")
          else if (line.startsWith('- ')) {
            // Handle the dash separately and process the rest for bold text
            const textAfterDash = line.slice(2);
            return (
              <p key={index} className="ml-6 text-gray-700">
                - {processBoldText(textAfterDash)}
              </p>
            );
          }
          // Default text handling
          else {
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
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isUser ? 'bg-teal-600' : 'bg-teal-100'}`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-teal-600" />}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] space-y-2 ${isUser ? 'items-end text-white' : 'items-start'}`}>
        {/* Content */}
        <div className={`p-4 rounded-2xl ${isUser ? 'bg-teal-600 text-white ml-auto' : 'bg-teal-50 text-gray-800'}`}>
          {renderFormattedContent(content)}
        </div>

        {/* Metadata (if available) */}
        {metadata && metadata.length > 0 && (
          <div className="p-4 rounded-2xl bg-gray-100 text-gray-800">
            <h3 className="font-semibold text-teal-600 mb-2">Related Documents:</h3>
            {metadata.slice(0, 3).map((meta, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold">Metadata {index + 1}:</h4>
                <p>Title: <span className="text-gray-700">{meta.title}</span></p>
                <p>Date of Issue: <span className="text-gray-700">{meta.date_of_issue}</span></p>
                <p>Dept: <span className="text-gray-700">{meta.dept}</span></p>
                <p>Document Code: <span className="text-gray-700">{meta.document_code}</span></p>
                <p>Summary: <span className="text-gray-700">{meta.section_summary}</span></p>
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