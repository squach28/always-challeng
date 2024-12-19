import express, { Request, Response } from "express";
import { authRouter } from "../routes/auth.route";
import { usersRouter } from "../routes/users.route";

export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ healthy: true });
  });

  return app;
};
