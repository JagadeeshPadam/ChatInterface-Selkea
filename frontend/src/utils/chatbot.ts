interface Response {
  text: string;
  timestamp: string;
}

const greetings = ['hi', 'hello', 'hey'];

export function generateResponse(message: string): Response {
  const normalizedMessage = message.toLowerCase().trim();
  
  let responseText = '';
  
  if (greetings.includes(normalizedMessage)) {
    const responses = [
      'Hello! How can I help you today?',
      'Hi there! What can I do for you?',
      'Hey! How can I assist you?'
    ];
    responseText = responses[Math.floor(Math.random() * responses.length)];
  } else {
    responseText = `I understand you said: "${message}". How can I help you further?`;
  }

  return {
    text: responseText,
    timestamp: new Date().toISOString()
  };
}