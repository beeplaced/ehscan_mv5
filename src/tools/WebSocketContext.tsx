// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
const webSocketUrl = window.location.hostname === 'localhost' ? 'ws://localhost:5683/ws' : 'wss://ehscan.com/ws'
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
//uuid persistent later!!!
// Define the shape of the WebSocket message

//userID
//connectionID

interface Message {
  type: string;
  content?: string;
  userId?: string | null;
  clientId?: string | null;
}

// Define the context type
interface WebSocketContextType {
  message: Message;
  sendMessage: (message: Message) => void;
}

// Create the WebSocket context with a default value
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Define the WebSocket provider component
interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  //const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<Message[]>([]);
  const [ws, setWs] = useState(new WebSocket(webSocketUrl));

    const addToMessage = (message: Message) => {
        message.userId = localStorage.getItem('userId')
        message.clientId = localStorage.getItem('clientId')
    return message
    }


  useEffect(() => {
    // Establish WebSocket connection
    //const ws = new WebSocket('ws://your-websocket-url');
    
     ws.onopen = async () => {
          const clientId = localStorage.getItem('clientId') || uuidv4();
          localStorage.setItem('clientId', clientId);
      // Prepare the message with clientId and userId, and send it
          const message = addToMessage({ type: 'client-id' });
          console.log(message)
          // Send the message through WebSocket
          ws.send(JSON.stringify(message));
    }

    //ws.onopen = () => console.log('Connected to WebSocket');
    ws.onclose = () => console.log('Disconnected from WebSocket');
    
    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data); // Parse incoming message as Message type
      setMessage(message);
    };

    ws.onerror = (error) => {
        console.log(error)
    };

    // Clean up WebSocket connection on component unmount
    return () => ws.close();
  }, []);

  const sendMessage = (message: Message) => {

    //     console.log(ws && ws.readyState === 1)
    //     console.log(ws.readyState === 3)
    //     console.log(ws.readyState)

    //     setTimeout(() => {
    //     console.log(ws && ws.readyState === 1)
    //   }, 1000); // Wait 1 second before retrying once

    //const message = addToMessage({ type: 'client-id' });
    
    const completeMessage = addToMessage(message);

    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(completeMessage));
      } else {
        console.log('Socket not open. Waiting 1 second to retry...');
        setTimeout(() => {
          if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify(completeMessage));
          } else {
            console.error('Failed to send message: WebSocket connection is not open.');
          }
        }, 1000); // Wait 1 second before retrying once
      }
  };

   return (
    <WebSocketContext.Provider value={{ message, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};