import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProfileManagement from '@/components/ProfileManagement';
import Layout from '@/components/Layout';

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>My Profile | Mentorship Platform</title>
        <meta name="description" content="View and edit your profile on the Mentorship Platform" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        {status === 'authenticated' ? (
          <ProfileManagement />
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;