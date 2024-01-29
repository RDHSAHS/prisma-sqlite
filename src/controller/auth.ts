import { Router, Request, Response, NextFunction } from "express";
import { checkSchema, validationResult } from "express-validator";
import { prisma, prismaExclude } from "../config/prisma";
import {
  RegisterAuthSchema,
  LoginAuthSchema,
} from "../schema/express-validator/auth";
import {
  Helper,
  parseJWT,
  tokenJWT,
  hashPassword,
  verivyPassword,
} from "../utils";
// import {sessionRepository} from "../schema/redis/session";

const router = Router();
const excludeUser = prismaExclude("User", ["password", "role"]);

//CODE API HERE
//------------------------------------------------------------------------------------------------

//REGISTER
router.post(
  "/register",
  checkSchema(RegisterAuthSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const formData = validationResult(req);

      if (!formData.isEmpty()) {
        return res.json({
          message: "Error from validation",
          formData,
        });
      }

      const { email, username, password, role }: any = req.body;
      const hashedPass = await hashPassword(password);

      const getEmail = await prisma.user.findFirst({
        where: email,
      });
      if (getEmail) {
        return res.status(400).json({
          message: "Email already used",
        });
      }

      const getUsername = await prisma.user.findFirst({
        where: username,
      });
      if (getUsername) {
        return res.status(400).json({
          message: "Used already used",
        });
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPass,
          role,
          unique: new Helper().generateRandomString(5),
        },
      });
      const message = `Success create new User with username: ${newUser.username}`;

      res.status(201).json({ message });
    } catch (err) {}
  }
);
