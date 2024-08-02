import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            Mentor-Mentee Platform
          </Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-200">
              Home
            </Link>
            {status === 'authenticated' && (
              <>
                <Link href="/projects" className="hover:text-blue-200">
                  Projects
                </Link>
                <Link href="/tasks" className="hover:text-blue-200">
                  Tasks
                </Link>
                <Link href="/bounties" className="hover:text-blue-200">
                  Bounties
                </Link>
                <Link href="/messages" className="hover:text-blue-200">
                  Messages
                </Link>
                <Link href={`/profile/${session.user.id}`} className="hover:text-blue-200">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Out
                </button>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link href="/auth/signin" className="hover:text-blue-200">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="hover:text-blue-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;