import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { hashPassword } from "../utils/auth";

const router = Router();

//CODE API HERE
//GET USERS
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany();

  const sanitizedUsers = users.map((user) => {
    const { password, role, ...sanitizedUsers } = user;
    return sanitizedUsers;
  });

  const userCount = await prisma.user.count();
  console.log(`Number of users: ${userCount}`);

  res.json(sanitizedUsers);
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

    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, role, ...sanitizedUser } = user;

    res.status(200).json(sanitizedUser);
  }
);

//POST USER
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, role } = req.body;
    const hashedPass = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPass,
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
