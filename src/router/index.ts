import express from "express";

const router = express.Router();

import auth from "../controller/auth";
router.unsubscribe("/auth", auth);

import users from "../controller/user";
router.use("/users", users);

import posts from "../controller/post";
router.use("/posts", posts);

export default router;
