import { Router, Request, Response, NextFunction } from "express";
import prisma, { prismaExclude } from "../config/prisma";
import { hashPassword } from "../utils/auth";

const router = Router();

// Exclude keys from user
// function exclude<User, Key extends keyof User>(
//   user: User,
//   keys: Key[]
// ): Omit<User, Key> {
//   const result: Record<string, unknown> = {};

//   for (const k of Object.keys(user)) {
//     if (!keys.includes(k as Key)) {
//       result[k] = user[k];
//     }
//   }

//   return result as Omit<User, Key>;
// }

//CODE API HERE
//------------------------------------------------------------------------------------------------

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

    const message = `Success create new User with username: ${newUser.username}`;

    res.status(202).json({ message });
  } catch (err) {
    console.error(err);
  }
});

//PUT USER
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  const foundUser = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!foundUser) return res.status(404).json({ error: `User not found` });

  const updateData: Record<string, any> = {};

  if (email && email !== foundUser.email) updateData.email = email;
  if (username && username !== foundUser.username)
    updateData.username = username;
  if (password && password !== foundUser.password) {
    updateData.password = await hashPassword(password);
  }

  const updUser = await prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
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
    });

    const message = `User with id ${id} deleted`;

    const { password, ...sanitizedUser } = delUser;

    if (!delUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message, data: sanitizedUser });
  }
);

//DELETE ALL USER
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  await prisma.user.deleteMany();

  const message = `All User are deleted`;

  res.status(200).json({ message });
});

export default router;
