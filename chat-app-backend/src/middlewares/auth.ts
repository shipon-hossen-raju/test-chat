import { Request, Response, NextFunction } from "express";

export const simpleAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token === "123456") {
    req.user = { id: "user1" }; // For demo, fake user
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
