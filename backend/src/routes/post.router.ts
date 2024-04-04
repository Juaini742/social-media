import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
} from "../controllers/post.controller";
const router = express.Router();

router.post("/post", createPost);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);

module.exports = router;
