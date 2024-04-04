import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
      res.status(400).json({message: "Missing information"});
      return;
    }

    const emailData = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailData) {
      res.status(400).json("Your email is already in use");
      return;
    }

    const salt = bcrypt.genSaltSync(8);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const userData = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({message: "Success", data: userData});
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      res.status(400).json({message: "Missing information"});
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({message: "User not found"});
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({message: "Something is going wrong"});
      return;
    }

    const token = jwt.sign({userId: user.id}, "secret", {
      expiresIn: "1d",
    });

    res.cookie("tokenAccess", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    });
    res.status(200).json(user.id);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      res.status(400).json("Something is going wrong");
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(400).json("Something went wrong");
      return;
    }

    const {username, email} = req.body;

    if (email === user.email) {
      res.status(400).json("Your email is already in use");
      return;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        email,
      },
    });

    res.status(200).json("User updated successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.cookie("tokenAccess", "", {
    expires: new Date(0),
  });

  res.status(200).send("ok");
};
