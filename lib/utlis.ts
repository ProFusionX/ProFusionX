import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { IncomingMessage, ServerResponse } from "http";
import { getServerSession } from "next-auth";

interface CustomIncomingMessage extends IncomingMessage {
  cookies: Partial<{ [key: string]: string }>;
}

export async function getUserFromSession(
  req: CustomIncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);

  if (session && session.user) {
    const user = await User.findOne({ email: session.user.email });
    return user;
  }

  return null;
}
