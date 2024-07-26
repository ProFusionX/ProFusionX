import jwt from "jsonwebtoken";

export function generateToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.NEXTAUTH_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
  return token;
}
