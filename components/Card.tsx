import React from "react";
import Image from "next/image";

interface CardProps {
  icon: string;
  heading: string;
  description: string;
}

const cards: CardProps[] = [
  {
    icon: "/icons/workplace.png",
    heading: "Task-Based Learning",
    description:
      "Work on actual tasks and projects, designed to help you build specific skills and gain confidence in your abilities. Get feedback and support every step of the way.",
  },
  {
    icon: "/icons/handshake.png",
    heading: "Delegate with Confidence",
    description:
      "Find skilled and eager mentees to delegate tasks to, freeing up your time to focus on high-impact projects. Develop the next generation of developers.",
  },
  {
    icon: "/icons/customer.png",
    heading: "Learn from the Best",
    description:
      "Get paired with experienced mentors who will guide you through real-world tasks and projects. Gain practical experience and build your skills.",
  },
  {
    icon: "/icons/connection.png",
    heading: "Share Your Expertise",
    description:
      "Give back to the community by sharing your knowledge and experience. Mentorship is a rewarding way to help others grow and develop.",
  },
];

const Card: React.FC<CardProps> = ({ icon, heading, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center w-full h-full">
      <div className="mb-4">
        <Image src={icon} alt="" width={64} height={64} />
      </div>
      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
        {heading}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 description">
        {description}
      </p>
    </div>
  );
};

const CardList: React.FC = () => {
  return (
    <div className="w-full px-4 py-8 bg-gradient-animated hide-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
