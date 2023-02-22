import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user: any;
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const skipAuth = ["createUser", "logUserIn"]; // Add the names of mutations that don't require authentication
  const { operationName } = req.body;

  if (skipAuth.includes(operationName)) {
    // Skip authentication for certain mutations
    return next();
  }

  let token;

  try {
    token = req.headers.authorization?.split(" ")[1];

    const decoded: any = jwt.verify(token || "", process.env.JWT_SECRET || "");

    if (decoded.exp < Date.now() / 1000) {
      res.status(400).json({ message: "Token Expired" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Unauthorized access" });
  }
  if (!token) {
    throw new Error("Unauthorized access");
  }
};

export default verifyToken;
