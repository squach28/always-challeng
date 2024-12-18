import { createServer } from "../utils/server";
import { isEmailTaken } from "../controllers/auth.controller";
import { pool } from "../database/db";
import { AuthDetails } from "../types/AuthDetails";
import { queries } from "../database/queries";

const app = createServer();

describe("auth endpoint tests", () => {});

describe("auth unit tests", () => {
  describe("isEmailTaken", () => {
    describe("given email is already taken", () => {
      it("should return true", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          await pool.query(queries.addUserToAuth, [
            authDetails.email,
            authDetails.password,
          ]);
          await client.query("COMMIT");
          const emailTaken = await isEmailTaken(authDetails.email);
          expect(emailTaken).toBe(true);
        } catch (e) {
          console.log(e);
        } finally {
          await client.query("DELETE FROM auth");
          client.release();
        }
      });
    });

    describe("given email is not taken", () => {
      it("should return false", async () => {
        const email = "bob@gmail.com";
        const emailTaken = await isEmailTaken(email);
        expect(emailTaken).toBe(false);
      });
    });
  });
});
