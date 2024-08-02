import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import MessageThread from '@/components/MessageThread';

interface User {
  id: string;
  name: string;
}

const MessagesPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchContacts();
    }
  }, [status, router]);

  const fetchContacts = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setContacts(data.filter((user: User) => user.id !== session?.user?.id));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4">Contacts</h2>
            <ul className="bg-white shadow-md rounded-lg overflow-hidden">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className={`p-4 cursor-pointer hover:bg-gray-100 ${
                    selectedContact === contact.id ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => setSelectedContact(contact.id)}
                >
                  {contact.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2">
            {selectedContact ? (
              <MessageThread recipientId={selectedContact} />
            ) : (
              <p className="text-center text-gray-500">Select a contact to start messaging</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;