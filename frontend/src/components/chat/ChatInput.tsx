import React, { useState } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import { generateResponse } from '../../utils/chatbot';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-teal-100">
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          className="p-2 hover:bg-teal-50 rounded-full transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5 text-teal-600" />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-white border border-teal-200 rounded-xl px-4 py-3 
            focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent
            placeholder-gray-400"
        />
        
        <button
          type="button"
          className="p-2 hover:bg-teal-50 rounded-full transition-colors"
          title="Voice input"
        >
          <Mic className="w-5 h-5 text-teal-600" />
        </button>
        
        <button
          type="submit"
          className="p-3 bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors text-white
            disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}