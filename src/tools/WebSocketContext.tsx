// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
const webSocketUrl = window.location.hostname === 'localhost' ? 'ws://localhost:5683/ws' : 'wss://ehscan.com/ws'
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

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

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<Message[]>([]);
  const [ws, setWs] = useState(new WebSocket(webSocketUrl));
  const [attempts, setAttempts] = useState(0);

    const addToMessage = (message: Message) => {
        message.userId = localStorage.getItem('userId')
        message.clientId = localStorage.getItem('clientId')
    return message
    }

  useEffect(() => {
    
     ws.onopen = async () => {
      setAttempts(0);
      console.log('Connected to WebSocket');
          const clientId = localStorage.getItem('clientId') || uuidv4();
          localStorage.setItem('clientId', clientId);
          const message = addToMessage({ type: 'client-id' });
          console.log(message)
          ws.send(JSON.stringify(message));
    }

    ws.onclose = () => {
        console.log('Disconnected from WebSocket', attempts);
          if (attempts >= 3 ){
            alert('Websocket failed, reload app and try again in a few moments')
             return
            }
          setTimeout(() => {
            setAttempts((prevAttempts) => prevAttempts + 1);
              setWs(new WebSocket(webSocketUrl))
          }, 5000);
    }
    
    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data); // Parse incoming message as Message type
      setMessage(message);
    };

    ws.onerror = (error) => {
        console.log(error)
        console.log("attempts",attempts)

    };

    // Clean up WebSocket connection on component unmount
    return () => ws.close();
  }, [ws]);

  const sendMessage = (message: Message) => {
    
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