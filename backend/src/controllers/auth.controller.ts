import { Request, Response } from "express";
import { pool } from "../database/db";
import { queries } from "../database/queries";
import { AuthDetails } from "../types/AuthDetails";

export const login = (req: Request, res: Response) => {
  res.status(503).json({ message: "Not implemented yet" });
};

export const signup = async (req: Request, res: Response) => {
  if (req.body === undefined) {
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

    registerUser(authDetails);
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
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const registerUser = async (authDetails: AuthDetails) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(queries.addUserToAuth, [
      authDetails.email,
      authDetails.password,
    ]);
    await client.query("COMMIT");
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    return false;
  } finally {
    client.release();
  }
};

const hashPassword = (password: string) => {};
