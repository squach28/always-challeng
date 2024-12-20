import { Request, Response } from "express";
import { pool } from "../database/db";
import { queries } from "../database/queries";
import { UserDetails } from "../types/UserDetails";

export const addUser = async (req: Request, res: Response) => {
  if (req.body === undefined) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  if (
    req.body.id === undefined ||
    req.body.firstName === undefined ||
    req.body.lastName === undefined ||
    req.body.email === undefined
  ) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const client = await pool.connect();
  try {
    const userDetails: UserDetails = {
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };
    await client.query("BEGIN");
    await addUserDetails(userDetails);
    await client.query("COMMIT");
    res.status(201).json({ message: "Success" });
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Something went wrong" });
  } finally {
    client.release();
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  if (req.params.id === undefined) {
    res.status(400).json({ mesage: "Bad request" });
    return;
  }

  if (req.body.firstName === undefined || req.body.lastName === undefined) {
    res.status(400).json({ mesage: "Bad request" });
    return;
  }
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  try {
    await updateUser(firstName, lastName, id);
    res.status(201).json({ message: "User updated" });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const removeUserById = async (req: Request, res: Response) => {
  if (req.params.id === undefined) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  try {
    const { id } = req.params;
    await deleteUser(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    if (req.params.id === undefined) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
    const { id } = req.params;
    const user = await getUser(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const addUserDetails = async (userDetails: UserDetails) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(queries.addUser, [
      userDetails.id,
      userDetails.firstName,
      userDetails.lastName,
      userDetails.email,
    ]);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return false;
  } finally {
    client.release();
  }
};

const getUser = async (id: string) => {
  try {
    const result = await pool.query(queries.getUserById, [id]);
    return result.rows[0];
  } catch (e) {
    return null;
  }
};

const updateUser = async (id: string, firstName: string, lastName: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    client.query(queries.updateUserById, [firstName, lastName, id]);
    await client.query("COMMIT");
    return true;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    return false;
  } finally {
    client.release();
  }
};

const deleteUser = async (id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(queries.deleteUserById, [id]);
    await client.query("COMMIT");
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    throw false;
  } finally {
    client.release();
  }
};
