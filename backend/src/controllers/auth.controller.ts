import { Request, Response } from "express";
import { pool } from "../database/db";
import { queries } from "../database/queries";
import { AuthDetails } from "../types/AuthDetails";
import bcrypt from "bcrypt";

export const login = (req: Request, res: Response) => {
  res.status(503).json({ message: "Not implemented yet" });
};

export const signup = async (req: Request, res: Response) => {
  if (req.body.email === undefined || req.body.password === undefined) {
    res.status(400).json({ message: "Bad request" });
    return;
  }
  const emailTaken = await isEmailTaken(req.body.email);

  if (emailTaken) {
    res.status(400).json({ message: "Email already taken" });
    return;
  }
  try {
    const authDetails: AuthDetails = {
      email: req.body.email,
      password: req.body.password,
    };

    await registerUser(authDetails);
    res.status(200).json({ message: "Success!" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const forgotPassword = (req: Request, res: Response) => {
  res.status(503).json({ message: "Not implemented yet" });
};

const isEmailTaken = async (email: string) => {
  try {
    const result = await pool.query(queries.getUserByEmail, [email]);
    if (result.rows.length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const registerUser = async (authDetails: AuthDetails) => {
  const client = await pool.connect();
  try {
    const hash = await hashPassword(authDetails.password);
    await client.query("BEGIN");
    await client.query(queries.addUserToAuth, [authDetails.email, hash]);
    await client.query("COMMIT");
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    return false;
  } finally {
    client.release();
  }
};

const hashPassword = async (password: string) => {
  const SALT_ROUNDS = 12;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (e) {
    throw e;
  }
};
