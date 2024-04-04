import {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["tokenAccess"];
  if (!token) {
    return next(new Error("Authorization is required"));
  }

  try {
    const decodedToken = jwt.verify(token, "secret");
    req.userId = (decodedToken as JwtPayload).userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.clearCookie("tokenAccess");
    }

    res.status(401).json({message: "Unauthorized access"});
  }
};
