import React from "react";
import Image from "next/image";

interface ProfileOverviewProps {
  user?: {
    id: string;
    role: string;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold">Profile Overview</h2>
      {user?.image && (
        <Image
          src={user.image}
          alt="Profile Picture"
          className="w-20 h-20 rounded-full"
          width={80}
          height={80}
        />
      )}
      <p className="text-gray-600">Name: {user?.name}</p>
      <p className="text-gray-600">Email: {user?.email}</p>
      <p className="text-gray-600">Role: {user?.role}</p>
    </div>
  );
};

export default ProfileOverview;
