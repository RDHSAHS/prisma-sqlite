import { Router, Request, Response, NextFunction } from "express";
import { prisma, prismaExclude } from "../config/prisma";
import { Helper, hashPassword } from "../utils";

const router = Router();
const excludeUser = prismaExclude("User", ["password", "role"]);

//CODE API HERE
//------------------------------------------------------------------------------------------------

//GET USERS
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany({
    select: excludeUser,
  });

  // const sanitizedUsers = users.map((user) => {
  //   const { password, role, ...sanitizedUsers } = user;
  //   return sanitizedUsers;
  // });

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

    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, role, ...sanitizedUser } = user;

    res.status(200).json(sanitizedUser);
  }
);

//PUT USER
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  const foundUser = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!foundUser) return res.status(404).json({ error: `User not found` });

  const updData: Record<string, any> = {};

  if (email && email !== foundUser.email) updData.email = email;
  if (username && username !== foundUser.username) updData.username = username;
  if (password && password !== foundUser.password) {
    updData.password = await hashPassword(password);
  }

  const updUser = await prisma.user.update({
    where: { id: Number(id) },
    data: updData,
    select: prismaExclude("User", ["password", "role"]),
  });

  const message = `User with id ${id} updated`;

  res.status(200).json({ message, data: updUser });
});

//DELETE USER
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const delUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
      select: excludeUser,
    });

    const message = `User with id ${id} deleted`;

    // const { password, ...sanitizedUser } = delUser;

    if (!delUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message, data: delUser });
  }
);

//DELETE ALL USER
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  await prisma.user.deleteMany();

  const message = `All User are deleted`;

  res.status(200).json({ message });
});

export default router;
