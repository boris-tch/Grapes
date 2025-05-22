import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './chat.css';
import logo from './greengrape.png';

const socket = io('https://grapes123123123123.onrender.com/', {
  transports: ['websocket'],
});


socket.on("connect", () => {
  console.log("✅ Connected to server with ID:", socket.id);
});

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');


  useEffect(() => {
    socket.on("receive_message", (msg) => {
      console.log("📨 Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!username.trim()) {
      alert('Please set a username first!');
      return;
    }
    if (message.trim()) {
      socket.emit('send_message', `${username}: ${message}`);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h2>The GrapeVine</h2>
        <img src={logo} className="App-logo" alt="logo"/>
        <div className="username-setter">
          <input
            type="text"
            placeholder="Enter your name"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tempUsername.trim()) {
                setUsername(tempUsername.trim());
                setTempUsername('');
              }
            }}
          />
          <button onClick={() => {
            if (tempUsername.trim()) {
              setUsername(tempUsername.trim());
              setTempUsername('');
            }
          }}>
            Set Name
          </button>
          <p>Your name: <strong>{username || 'Not set'}</strong></p>
        </div>

      </div>

      <div className="chat-main">
        <div className="messages">
          {messages.map((msg, i) => {
            const [name, ...content] = msg.split(':');
            const isOwn = name.trim() === username.trim();

            return (
              <div key={i} className={`message ${isOwn ? 'own-message' : ''}`}>
                <strong>{name}:</strong>{content.join(':')}
              </div>
            );
          })}
        </div>

        <div className="input-bar">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
