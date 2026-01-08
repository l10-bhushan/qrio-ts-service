import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { prisma } from "../../config/db.ts";
import type { UserLogin, UserSignup } from "../../types/user.model.ts";

const handleUserRegisteration = async (req: Request, res: Response) => {
  // Getting the user from request body
  const user: UserSignup = req.body;

  try {
    // Checking if email exists
    const emailExists = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (emailExists) {
      return res.status(409).json({
        error: `Account with ${emailExists.email} already exists, please use a different`,
      });
    }
  } catch (err) {
    return res.status(400).json({ error: "Failed" });
  }

  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(process.env.SALT_ROUNDS) || 10
  );

  // Creating the user
  try {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        password: hashedPassword,
      },
    });
    return res.status(201).json({
      status: "success",
      data: {
        id: createdUser.id,
        email: createdUser.email,
      },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to create user, please check with admin" });
  }
};

const handleUserLogin = async (req: Request, res: Response) => {
  // Getting the user from request body
  const user: UserLogin = req.body;

  // Checking if we have an account with the provided email
  const emailExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  // If account is not present, return error message
  if (!emailExists) {
    return res.status(400).json({
      error: "Email does not exist, please register to access",
    });
  }

  // If email is present than, compare password and send jwt token
  const verification = await bcrypt.compare(
    user.password,
    emailExists.password
  );

  if (verification) {
    return res.status(200).json({
      status: "success",
      data: emailExists,
    });
  } else {
    return res.status(400).json({
      error: "Invalid credentials",
    });
  }
};

const handleUserLogout = (req: Request, res: Response) => {};

export { handleUserRegisteration, handleUserLogin, handleUserLogout };
