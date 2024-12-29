import React, { useState } from 'react';
import ChatSection from '../chat/ChatSection';
import InfoPanel from '../info/InfoPanel';
import { Message } from '../../types/chat';

interface MainContentProps {
  sessionId: string;
  messages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
}


export default function MainContent({ sessionId, messages = [], onUpdateMessages }: MainContentProps) {
  const [references, setReferences] = useState<any[]>([]); // State to store references

  const handleFetchReferences = (newReferences: any[]) => {
    setReferences(newReferences); // Update references state
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <ChatSection
        sessionId={sessionId}
        messages={messages}
        onUpdateMessages={onUpdateMessages}
        onFetchReferences={handleFetchReferences} // Pass function to handle references
      />
      <InfoPanel references={references} /> {/* Pass references to InfoPanel */}
    </div>
  );
}
