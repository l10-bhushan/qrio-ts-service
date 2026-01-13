import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { Response } from "express";
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || "7d";

const generateJWTToken = (userId: string, res: Response) => {
  const payload = { id: userId };
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRES_IN,
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

function encodeBase62(num: number): string {
  let result = "";
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

export { generateJWTToken, encodeBase62 };
