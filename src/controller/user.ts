import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

const router = Router();

//CODE API HERE
//GET USERS
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany();

  const userCount = await prisma.user.count();
  console.log(`Number of users: ${userCount}`);

  res.json(users);
});

//GET USER BY ID
router.get(
  "/:docid",
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

//POST USER
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

    const resp = `Success create new User with username: ${newUser.username}`;

    res.status(202).json({ message: resp });
  } catch (err) {
    console.error(err);
  }
});

export default router;
