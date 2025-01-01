// import React, { useState } from 'react';
// import ChatSection from '../chat/ChatSection';
// import InfoPanel from '../info/InfoPanel';
// import { Message } from '../../types/chat';

// interface MainContentProps {
//   sessionId: string;
//   messages: Message[];
//   onUpdateMessages: (messages: Message[]) => void;
// }


// export default function MainContent({ sessionId, messages = [], onUpdateMessages }: MainContentProps) {
//   const [references, setReferences] = useState<any[]>([]); // State to store references
//   console.log(sessionId);

//   const handleFetchReferences = (newReferences: any[]) => {
//     setReferences(newReferences); // Update references state
//   };

//   return (
//     <div className="flex-1 flex overflow-hidden">
//       <ChatSection
//         sessionId={sessionId}
//         messages={messages}
//         onUpdateMessages={onUpdateMessages}
//         onFetchReferences={handleFetchReferences} // Pass function to handle references
//       />
//       <InfoPanel references={references} /> {/* Pass references to InfoPanel */}
//     </div>
//   );
// }

import React, { useEffect } from 'react';
import ChatSection from '../chat/ChatSection';
import InfoPanel from '../info/InfoPanel';
import { Message } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';

interface MainContentProps {
  sessionId: string;
  messages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
}

export default function MainContent({ sessionId, messages = [], onUpdateMessages }: MainContentProps) {
  const [references, setReferences] = React.useState<any[]>([]); // State to store references
  const {user} = useAuth();
  // Function to fetch messages from backend
  const fetchMessages = async () => {
    try {
      const requestBody={
        session_id: sessionId,
        username : user?.username
      }
      const response = await fetch('http://localhost:8000/chat/session_chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      console.log(data)
      const formattedMessages: Message[] = data.messages.flatMap((msg: any) => [
        {
          id: `${msg.timestamp.$date}-query`, // Unique ID for the query
          content: msg.query,                // The query as content
          isUser: true,                      // User message
          timestamp: new Date(msg.timestamp.$date).toISOString(),
        },
        {
          id: `${msg.timestamp.$date}-content`, // Unique ID for the content
          content: msg.content,                 // Bot's response
          isUser: false,                        // Bot message
          timestamp: new Date(msg.timestamp.$date).toISOString(),
          metadata: msg.metadata || undefined, // Include metadata if available
        },
      ]);
      

      onUpdateMessages(formattedMessages); // Update messages in the parent state
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch messages when component mounts
  React.useEffect(() => {
    if (sessionId) {
      fetchMessages();
    }
  }, [sessionId]);

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
