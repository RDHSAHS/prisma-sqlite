import express from "express";
// import path from "path";

const router = express.Router();

import users from "../controller/user";
router.use("/users", users);

export default router;
