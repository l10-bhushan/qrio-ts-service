import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.ts";

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let jwtAuthToken;

  // Fetching the jwt token from either headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    jwtAuthToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.access_token) {
    jwtAuthToken = req.cookies?.access_token;
  }

  // If no jwttoken found return error
  if (!jwtAuthToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify the jwt token and add the user data to req
  try {
    const response = jwt.verify(
      jwtAuthToken,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: {
        id: response.id,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = {
      userId: user.id,
    };
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
