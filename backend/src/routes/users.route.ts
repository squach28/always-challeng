import express from "express";
import {
  addUser,
  getUserById,
  removeUserById,
  updateUserById,
} from "../controllers/users.controller";

export const usersRouter = express.Router();

usersRouter.get("/:id", getUserById);
usersRouter.post("/", addUser);
usersRouter.put("/:id", updateUserById);
usersRouter.delete("/:id", removeUserById);
