import { Router, Request, Response } from "express";
import { check, checkSchema, validationResult } from "express-validator";
import { prisma, prismaExclude } from "../config";
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
import { sessionRepository } from "../schema/redis/session";

const router = Router();
const excludeUser = prismaExclude("User", ["password", "role"]);

//CODE API HERE
//------------------------------------------------------------------------------------------------

//REGISTER
router.post(
  "/register",
  checkSchema(RegisterAuthSchema),
  async (req: Request, res: Response) => {
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
          message: "Username already used",
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
    } catch (err) {
      return res.json({
        message: "Something went wrong",
        err,
      });
    }
  }
);

//LOGIN
router.post(
  "/login",
  checkSchema(LoginAuthSchema),
  async (req: Request, res: Response) => {
    try {
      const formData = validationResult(req);

      if (!formData.isEmpty()) {
        return res.json({
          message: "Error from validator",
          formData,
        });
      }

      const { identifier, password }: any = req.body;

      const getUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: identifier }, { email: identifier }],
        },
      });

      if (!getUser) {
        return res.status(404).json({
          message: "Username/email does not found",
        });
      }

      const validatedUser = await verivyPassword(password, getUser.password);

      if (!validatedUser) {
        return res.status(404).json({
          message: "Wrong username/email/password",
        });
      }

      const tokenData = tokenJWT({
        docid: getUser.docid,
        unique: getUser.unique,
      });

      const userSession = await sessionRepository.fetch(getUser.docid);

      if (userSession.tokenData) {
        return res.status(400).json({
          message: "User already logged in",
        });
      }

      await sessionRepository.save(getUser.docid, {
        tokenData,
      });

      return res.status(200).json({
        message: "Login success",
        data: tokenData,
      });
    } catch (err) {
      return res.json({
        message: "Something went wrong",
        err,
      });
    }
  }
);
