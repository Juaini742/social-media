import express from "express";
import {getUserById, logout, updateUser} from "../controllers/user.controller";
import {verifyToken} from "../middleware";
import {getPosts} from "../controllers/post.controller";
const router = express.Router();
const userRouter = require("./user.router");
const postRouter = require("./post.router");

// public
router.use("/public/user", userRouter);
router.get("/public/post", getPosts);

// secure
router.use([verifyToken]);
router.get("/secured/user/userById", getUserById);
router.post("/secured/user/update", updateUser);
router.post("/secured/user/logout", logout);
router.use("/secured", postRouter);

export default router;
