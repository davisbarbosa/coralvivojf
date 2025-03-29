import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findFirst({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const md5Hash = crypto.createHash('md5').update(password).digest('hex');
    const isValidPassword = md5Hash === user.password;

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login" });
  }
};