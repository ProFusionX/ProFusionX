import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Message from "@/lib/models/Message";

export default async function handler(req: any, res: NextApiResponse) {
  await dbConnect();

  const session = req.session;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Handle GET request
    try {
      const messages = await Message.find({
        recipient: session.user.id,
      }).exec();
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else if (req.method === "POST") {
    // Handle POST request
    const { recipientId, content } = req.body;
    const newMessage = new Message({
      sender: session.user.id,
      recipient: recipientId,
      content,
      createdAt: new Date(),
    });

    try {
      const result = await newMessage.save();
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to save message" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
