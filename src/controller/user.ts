import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { convertBigInt } from "../utils/converter";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany();

  const usersCount = await prisma.user.count();
  console.log(`Number of users: ${usersCount}`);

  res.json(convertBigInt(users));
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, role } = convertBigInt(req.body);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password,
        role,
      },
    });

    res.status(202).json(newUser);
  } catch (err) {
    console.error(err, "<<<<<<<<");
  }
});

export default router;
