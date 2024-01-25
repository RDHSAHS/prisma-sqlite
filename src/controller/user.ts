import { Router, Request, Response, NextFunction } from "express";
// import { param, query, body, validationResult } from "express-validator";
import prisma from "../config/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany();

  const usersCount = await prisma.user.count();
  console.log(`Number of users: ${usersCount}`);

  res.json(users);
});

router.get(
  "/:docid",
  // param("docid").isUUID(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { docid } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        docid,
      },
      include: {
        posts: true,
      },
    });

    res.status(200).json(user);
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, role } = req.body;

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
    console.error(err);
  }
});

export default router;
