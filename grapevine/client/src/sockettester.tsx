import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // or your actual server address

export default function SocketTester() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1></h1>
    </div>
  );
}