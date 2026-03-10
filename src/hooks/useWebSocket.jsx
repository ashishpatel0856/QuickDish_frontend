import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (userId, restaurantId, onMessage) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        setConnected(true);
        console.log('WebSocket Connected');
        
        // Customer notifications
        if (userId) {
          client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
            const body = JSON.parse(message.body);
            console.log('Customer notification:', body);
            onMessage?.(body);
          });
        }
        
        // Restaurant owner notifications
        if (restaurantId) {
          client.subscribe(`/topic/restaurant/${restaurantId}`, (message) => {
            const body = JSON.parse(message.body);
            console.log(' Restaurant notification:', body);
            onMessage?.(body);
          });
        }
      },
      
      onDisconnect: () => {
        setConnected(false);
        console.log(' WebSocket Disconnected');
      },
      
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [userId, restaurantId]);

  return { connected };
};