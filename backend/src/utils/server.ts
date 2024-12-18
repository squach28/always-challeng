import express, { Request, Response } from "express";
import { authRouter } from "../routes/auth.route";
import dotenv from "dotenv";

dotenv.config();

export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ healthy: true });
  });

  return app;
};
