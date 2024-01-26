import express from "express";

const router = express.Router();

import users from "../controller/user";
router.use("/users", users);

export default router;
