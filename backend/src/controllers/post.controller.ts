import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const getPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const datas = await prisma.post.findMany();

    res.status(200).json(datas);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {title, content} = req.body;
    const userId = req.userId;

    if (!title || !content) {
      res.status(400).json("Something went wrong");
      return;
    }

    const datas = await prisma.post.create({
      data: {
        title,
        content,
        user: {connect: {id: userId}},
      },
    });

    res.status(200).json({message: "Post created successfully", data: datas});
  } catch (error) {
    res.status(200).json("Internal server error");
  }
};

export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.id;

    if (!postId) {
      res.status(400).json({message: "Parameter is required"});
      return;
    }

    const data = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!data) {
      res.status(400).json({message: "Post not found"});
      return;
    }
    const {title, content} = req.body;

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
      },
    });

    res.status(200).json("Update post successfully");
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.id;

    if (!postId) {
      res.status(400).json({message: "Parameter is required"});
      return;
    }

    const data = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    if (!data) {
      res.status(404).json({message: "Post not found"});
      return;
    }

    res.status(200).json({message: "Post deleted successfully", data: data});
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
