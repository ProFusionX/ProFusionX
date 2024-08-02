import { getUserFromSession } from "@/lib/utlis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const user = await getUserFromSession(req, res);

    if (user) {
      return res.status(200).json({
        id: user._id.toString(),
        name: user.name,
      });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
