'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  recipient: {
    _id: string;
    name: string;
  };
  content: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient, content: newMessage }),
    });
    const data = await res.json();
    if (data.success) {
      setMessages([...messages, data.data]);
      setNewMessage('');
      setRecipient('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      <div className="mb-4">
        {messages.map((message) => (
          <div key={message._id} className="border-b py-2">
            <p><strong>From:</strong> {message.sender.name}</p>
            <p><strong>To:</strong> {message.recipient.name}</p>
            <p>{message.content}</p>
            <p className="text-gray-500 text-sm">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {session && (
        <div className="border-t py-4">
          <h2 className="text-2xl font-bold mb-2">Send a new message</h2>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient ID"
            className="border p-2 mb-2 w-full"
          />
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Your message"
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}