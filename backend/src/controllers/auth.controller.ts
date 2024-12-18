import { Request, Response } from "express";
import { pool } from "../db";

export const login = (req: Request, res: Response) => {
  res.status(503).json({ message: "Not implemented yet" });
};

export const signup = (req: Request, res: Response) => {
  res.status(503).json({ message: "Not implemented yet" });
};

export const forgotPassword = (req: Request, res: Response) => {
  res.status(503).json({ message: "Not implemented yet" });
};
