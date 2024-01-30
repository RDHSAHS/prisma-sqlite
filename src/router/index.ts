import express from "express";

const router = express.Router();

import auth from "../controller/auth";
router.use("/auth", auth);

import users from "../controller/user";
router.use("/users", users);

import posts from "../controller/post";
router.use("/posts", posts);

import amqp from "../controller/rabbitmq";
router.use("/amqp", amqp);

export default router;
