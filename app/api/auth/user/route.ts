import { getUserFromSession } from "@/lib/utlis";
import { NextResponse } from "next/server";
import { IncomingMessage, ServerResponse } from "http";

export async function GET(req: any) {
  const res: ServerResponse<IncomingMessage> = req.res;

  const user = await getUserFromSession(req, res);

  if (user) {
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
    });
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
