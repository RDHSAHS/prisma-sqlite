import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

const router = Router();

router.get(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();
    res.json(users);
  }
);
