import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
          name: user.name,
          email: user.email,
          bio: user.bio,
          skills: user.skills,
          role: user.role,
        });
      } catch (error) {
        res.status(500).json({ error: "Error fetching profile" });
      }
      break;

    case "PUT":
      try {
        const { name, bio, skills } = req.body;
        const user = await User.findOneAndUpdate(
          { email: session.user.email },
          { $set: { name, bio, skills } },
          { new: true, runValidators: true }
        );
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
          name: user.name,
          email: user.email,
          bio: user.bio,
          skills: user.skills,
          role: user.role,
        });
      } catch (error) {
        res.status(500).json({ error: "Error updating profile" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
