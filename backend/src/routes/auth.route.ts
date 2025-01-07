import express from "express";
import { forgotPassword, login, signup } from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/forgotPassword", forgotPassword);
