import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface MessageThreadProps {
  recipientId: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ recipientId }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/messages?recipientId=${recipientId}`);
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();

    // Set up Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(
      `chat-${session?.user?.id}-${recipientId}`
    );
    channel.bind("new-message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe(`chat-${session?.user?.id}-${recipientId}`);
    };
  }, [recipientId, session?.user?.id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && session?.user?.id) {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          content: newMessage,
          senderId: session.user.id,
        }),
      });
      const sentMessage = await response.json();
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="h-96 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${
              message.senderId === session?.user?.id
                ? "text-right"
                : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.senderId === session?.user?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.content}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border rounded-l-lg p-2"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageThread;
