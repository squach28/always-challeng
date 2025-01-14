import { Request, Response } from "express";
import { pool } from "../database/db";
import { queries } from "../database/queries";
import { AuthDetails } from "../types/AuthDetails";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  // body with email and password fields are required
  if (req.body.email === undefined || req.body.password === undefined) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  // fields cannot be blank
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const { email, password } = req.body;

  const emailExists = await doesEmailExist(email);

  if (!emailExists) {
    res.status(400).json({ message: "User with email not found" });
    return;
  }

  const loginResult = await loginUser(email, password);

  if (!loginResult) {
    res.status(400).json({ message: "Incorrect credentials" });
    return;
  }

  res.status(200).json({ message: "Success!" });
};

export const signup = async (req: Request, res: Response) => {
  // body with email and password fields are required
  if (req.body.email === undefined || req.body.password === undefined) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  // fields cannot be blank
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).json({ message: "Bad request" });
    return;
  }
  const emailTaken = await doesEmailExist(req.body.email);

  // email must be unique
  if (emailTaken) {
    res.status(400).json({ message: "Email already taken" });
    return;
  }
  try {
    const authDetails: AuthDetails = {
      email: req.body.email,
      password: req.body.password,
    };

    const id = await registerUser(authDetails);
    res.status(201).json({ id });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const forgotPassword = (req: Request, res: Response) => {
  res.status(503).json({ message: "Not implemented yet" });
};

export const doesEmailExist = async (email: string) => {
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

export const registerUser = async (
  authDetails: AuthDetails
): Promise<string | null> => {
  const client = await pool.connect();
  try {
    const hash = await hashPassword(authDetails.password);
    await client.query("BEGIN");
    const result = await client.query(queries.addUserToAuth, [
      authDetails.email,
      hash,
    ]);
    await client.query("COMMIT");
    const { id } = result.rows[0];
    return id;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    return null;
  } finally {
    client.release();
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const result = await pool.query(queries.getAuthByEmail, [email]);
    const user = result.rows[0];

    const loginResult = await bcrypt.compare(password, user.password);
    return loginResult;
  } catch (e) {
    console.log(e);
    return false;
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
