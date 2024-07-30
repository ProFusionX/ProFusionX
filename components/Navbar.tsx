import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              ProConnect
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {session?.user.role === "mentor" && (
                <Link
                  href="/dashboard/mentor"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mentor Dashboard
                </Link>
              )}
              {session?.user.role === "mentee" && (
                <Link
                  href="/dashboard/mentee"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-green-600"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v13m0-13V0l4 4m-4 4L12 4"
                    />
                  </svg>
                  Mentee Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-gray-700">{session?.user.name}</span>
              {session?.user?.image && (
                <Image
                  src={session?.user?.image}
                  alt="Profile Picture"
                  className="w-8 h-8 rounded-full ml-2"
                  width={32}
                  height={32}
                />
              )}
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
