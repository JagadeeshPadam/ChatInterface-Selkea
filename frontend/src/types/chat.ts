export interface Message {
  id: string;                   // Unique identifier for the message
  content: string;               // The text content displayed in the chat
  isUser: boolean;               // Whether the message was sent by the user (true) or the bot (false)
  timestamp: string;             // Timestamp when the message was sent
  metadata?: MessageMetadata;    // Optional metadata that includes additional information (not displayed)
}

export interface MessageMetadata {
  date_of_issue: string;
  dept: string;
  document_code: string;
  section_summary: string;
  pdf_filename?: string;        // Optional fields
  pdf_link?: string;
  status?: string;
  title?: string;
  collection_name?: string;
  id?: string;
}



export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
}

export interface UserProfile {
  username: string;
  purpose: string;
}