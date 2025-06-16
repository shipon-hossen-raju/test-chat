import express, { Request, Response } from "express";
import prisma from "../../prisma";

const authRouter = express.Router();

// Signup route
authRouter.post("/signup", async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({ where: { name } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        password, // 🔒 In real app, hash this
      },
    });

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
});

// login user
authRouter.post("/login", async (req: Request, res: Response) => {
   const { name, password } = req.body;

   try {
    const user = await prisma.user.findFirst({ where: { name, password } });
    if (user) {
      return res.status(200).json({ message: "Login successful", user });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

export default authRouter;
