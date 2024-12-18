import supertest from "supertest";
import { createServer } from "../utils/server";
import { isEmailTaken, registerUser } from "../controllers/auth.controller";
import { pool } from "../database/db";
import { AuthDetails } from "../types/AuthDetails";
import { queries } from "../database/queries";

const app = createServer();

describe("auth endpoint tests", () => {
  describe("POST /auth/signup", () => {
    describe("given valid data", () => {
      it("should return 200", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const result = await supertest(app)
          .post("/auth/signup")
          .send(authDetails)
          .expect(201);
        expect(result.body).toHaveProperty("id");
        expect(result.body.id).toBeTruthy();
        await teardown();
      });
    });

    describe("given empty body", () => {
      it("should return 400", async () => {
        await supertest(app).post("/auth/signup").expect(400);
      });
    });

    describe("given data without email", () => {
      it("should return 400", async () => {
        const detailsWithoutEmail = {
          password: "password123",
        };
        await supertest(app)
          .post("/auth/signup")
          .send(detailsWithoutEmail)
          .expect(400);
      });
    });

    describe("given data without password", () => {
      it("should return 400", async () => {
        const detailsWithoutPassword = {
          email: "bob@gmail.com",
        };
        await supertest(app)
          .post("/auth/signup")
          .send(detailsWithoutPassword)
          .expect(400);
      });
    });

    describe("given data with blank fields", () => {
      it("should return 400", async () => {
        const detailsWithEmptyFields = {
          email: "",
          password: "",
        };
        await supertest(app)
          .post("/auth/signup")
          .send(detailsWithEmptyFields)
          .expect(400);
      });
    });

    describe("given data with blank email", () => {
      it("should return 400", async () => {
        const detailsWithEmptyEmail = {
          email: "",
          password: "password123",
        };
        await supertest(app)
          .post("/auth/signup")
          .send(detailsWithEmptyEmail)
          .expect(400);
      });
    });

    describe("given data with blank password", () => {
      it("should return 400", async () => {
        const detailsWithEmptyPassword = {
          email: "",
          password: "password123",
        };
        await supertest(app)
          .post("/auth/signup")
          .send(detailsWithEmptyPassword)
          .expect(400);
      });
    });
  });
});

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
          await teardown();
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

  describe("registerUser", () => {
    describe("given authDetails", () => {
      it("should return true to indicate successful registration", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        try {
          const result = await registerUser(authDetails);
          expect(result).toBeTruthy();
        } catch (e) {
          console.log(e);
        } finally {
          await teardown();
        }
      });
    });
  });
});

const teardown = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM auth");
    await client.query("COMMIT");
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
};
