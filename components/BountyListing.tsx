import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Bounty {
  _id: string;
  title: string;
  description: string;
  mentor: {
    _id: string;
    name: string;
  };
  amount: number;
  requiredSkills: string[];
  status: 'open' | 'in-progress' | 'completed';
}

const BountyListing: React.FC = () => {
  const { data: session } = useSession();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [newBounty, setNewBounty] = useState({ title: '', description: '', amount: 0, requiredSkills: '' });

  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      const response = await fetch('/api/bounties');
      if (!response.ok) throw new Error('Failed to fetch bounties');
      const data = await response.json();
      setBounties(data);
    } catch (error) {
      console.error('Error fetching bounties:', error);
    }
  };

  const handleCreateBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bounties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBounty,
          requiredSkills: newBounty.requiredSkills.split(',').map(skill => skill.trim()),
        }),
      });
      if (!response.ok) throw new Error('Failed to create bounty');
      fetchBounties();
      setNewBounty({ title: '', description: '', amount: 0, requiredSkills: '' });
    } catch (error) {
      console.error('Error creating bounty:', error);
    }
  };

  const handleApplyToBounty = async (bountyId: string) => {
    try {
      const response = await fetch(`/api/bounties/${bountyId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'I would like to apply for this bounty.' }),
      });
      if (!response.ok) throw new Error('Failed to apply to bounty');
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to bounty:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Bounties</h2>
      {(session?.user as any)?.role === 'mentor' && (
        <form onSubmit={handleCreateBounty} className="mb-6">
          <input
            type="text"
            placeholder="Bounty title"
            value={newBounty.title}
            onChange={(e) => setNewBounty({ ...newBounty, title: e.target.value })}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newBounty.description}
            onChange={(e) => setNewBounty({ ...newBounty, description: e.target.value })}
            className="border p-2 mr-2"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newBounty.amount}
            onChange={(e) => setNewBounty({ ...newBounty, amount: Number(e.target.value) })}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            placeholder="Required Skills (comma-separated)"
            value={newBounty.requiredSkills}
            onChange={(e) => setNewBounty({ ...newBounty, requiredSkills: e.target.value })}
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Bounty
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bounties.map((bounty) => (
          <div key={bounty._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">{bounty.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{bounty.description}</p>
            <p className="text-sm">Amount: ${bounty.amount}</p>
            <p className="text-sm">Mentor: {bounty.mentor.name}</p>
            <p className="text-sm">Required Skills: {bounty.requiredSkills.join(', ')}</p>
            <p className="text-sm font-medium mt-2">Status: {bounty.status}</p>
            {(session?.user as any)?.role === 'mentee' && bounty.status === 'open' && (
              <button
                onClick={() => handleApplyToBounty(bounty._id)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-sm"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BountyListing;