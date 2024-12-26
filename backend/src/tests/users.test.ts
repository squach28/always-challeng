import supertest from "supertest";
import { registerUser } from "../controllers/auth.controller";
import {
  addUserDetails,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/users.controller";
import { pool } from "../database/db";
import { AuthDetails } from "../types/AuthDetails";
import { UserDetails } from "../types/UserDetails";
import { createServer } from "../utils/server";

const app = createServer();

// TODO: finish endpoint tests
describe("users endpoints tests", () => {
  describe("POST /users", () => {
    afterEach(async () => {
      await teardown();
    });

    describe("given all missing fields", () => {
      it("should return 400", async () => {
        await supertest(app).post("/users").send({}).expect(400);
      });
    });

    describe("given missing id", () => {
      it("should return 400", async () => {
        const detailsWithoutId = {
          email: "bob@gmail.com",
          firstName: "Bob",
          lastName: "Jenkins",
        };
        await supertest(app).post("/users").send(detailsWithoutId).expect(400);
      });
    });

    describe("given missing firstName", () => {
      it("should return 400", async () => {
        const detailsWithoutFirstName = {
          id: "94376268-1f12-4914-8f5e-c989bd4ee3b1",
          email: "bob@gmail.com",
          lastName: "Jenkins",
        };
        await supertest(app)
          .post("/users")
          .send(detailsWithoutFirstName)
          .expect(400);
      });
    });

    describe("given missing lastName", () => {
      it("should return 400", async () => {
        const detailsWithoutLastName = {
          id: "94376268-1f12-4914-8f5e-c989bd4ee3b1",
          email: "bob@gmail.com",
          firstName: "Bob",
        };
        await supertest(app)
          .post("/users")
          .send(detailsWithoutLastName)
          .expect(400);
      });
    });

    describe("given missing email", () => {
      it("should return 400", async () => {
        const detailsWithoutEmail = {
          id: "94376268-1f12-4914-8f5e-c989bd4ee3b1",
          firstName: "Bob",
          lastName: "Jenkins",
        };
        await supertest(app)
          .post("/users")
          .send(detailsWithoutEmail)
          .expect(400);
      });
    });

    describe("given valid data, but user isn't in auth table", () => {
      it("should return 400?", async () => {
        const userDetails: UserDetails = {
          id: "94376268-1f12-4914-8f5e-c989bd4ee3b1",
          firstName: "Bob",
          lastName: "Jenkins",
          email: "bob@gmail.com",
        };

        const result = await supertest(app).post("/users").send(userDetails);
        expect(result.body).toHaveProperty("message");
      });
    });

    describe("given valid data and user is in auth table", () => {
      it("should return 201", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const newUserId = await registerUser(authDetails);
        expect(newUserId).not.toBe(null);

        const userDetails: UserDetails = {
          id: newUserId as string,
          email: authDetails.email,
          firstName: "Bob",
          lastName: "Jenkins",
        };

        await supertest(app).post("/users").send(userDetails).expect(201);
      });
    });
  });

  describe("GET /users/:id", () => {
    describe("given user with id doesn't exist", () => {
      it("should return 404", async () => {
        const userId = "94376268-1f12-4914-8f5e-c989bd4ee3b1";
        await supertest(app).get(`/users/${userId}`).expect(404);
      });
    });

    describe("given user with id does exist", () => {
      it("should return 200", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const newUserId = await registerUser(authDetails);
        expect(newUserId).not.toBe(null);

        const userDetails: UserDetails = {
          id: newUserId as string,
          email: authDetails.email,
          firstName: "Bob",
          lastName: "Jenkins",
        };

        const userDetailsAdded = await addUserDetails(userDetails);
        expect(userDetailsAdded).toBe(true);

        await supertest(app).get(`/users/${newUserId}`).expect(200);
      });
    });
  });
});
// Users unit tests
describe("users unit tests", () => {
  afterEach(async () => {
    await teardown();
  });

  describe("addUserDetails", () => {
    describe("given user doesn't already exist in auth table", () => {
      it("should return false", async () => {
        const userDetails: UserDetails = {
          id: "94376268-1f12-4914-8f5e-c989bd4ee3b1",
          firstName: "Bob",
          lastName: "Jenkins",
          email: "bob@gmail.com",
        };
        const result = await addUserDetails(userDetails);
        expect(result).toBe(false);
      });
    });
    describe("given user already exists in auth table", () => {
      it("should return true", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const newUserId = await registerUser(authDetails);
        expect(newUserId).not.toBe(null);

        const userDetails: UserDetails = {
          id: newUserId as string,
          email: authDetails.email,
          firstName: "Bob",
          lastName: "Jenkins",
        };

        const userDetailsAdded = await addUserDetails(userDetails);
        expect(userDetailsAdded).toBe(true);
      });
    });
  });
  describe("getUser", () => {
    describe("given user is not in table", () => {
      it("should return null", async () => {
        const user = await getUser("94376268-1f12-4914-8f5e-c989bd4ee3b1");
        expect(user).toBe(null);
      });
    });

    describe("given user is in table", () => {
      it("should return correct userDetails object", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const newUserId = await registerUser(authDetails);
        expect(newUserId).not.toBe(null);

        const userDetails: UserDetails = {
          id: newUserId as string,
          email: authDetails.email,
          firstName: "Bob",
          lastName: "Jenkins",
        };

        const userAdded = await addUserDetails(userDetails);
        expect(userAdded).toBe(true);

        const user = (await getUser(newUserId as string)) as UserDetails;
        expect(user).not.toBe(null);
        expect(user.id).toBe(newUserId);
        expect(user.email).toBe(userDetails.email);
        expect(user.firstName).toBe(userDetails.firstName);
        expect(user.lastName).toBe(userDetails.lastName);
      });
    });
  });

  describe("updateUser", () => {
    describe("given user is not in table", () => {
      it("should return false", async () => {
        const userDetails: UserDetails = {
          id: "94376268-1f12-4914-8f5e-c989bd4ee3b1",
          email: "bob@gmail.com",
          firstName: "Bob",
          lastName: "Jenkins",
        };
        const result = await updateUser(
          userDetails.id,
          userDetails.firstName,
          userDetails.lastName
        );
        expect(result).toBe(false);
      });
    });
    describe("given user is in table", () => {
      it("should return true", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const newUserId = await registerUser(authDetails);
        expect(newUserId).not.toBe(null);

        const userDetails: UserDetails = {
          id: newUserId as string,
          email: authDetails.email,
          firstName: "Bob",
          lastName: "Jenkins",
        };

        await addUserDetails(userDetails);

        const user = (await getUser(newUserId as string)) as UserDetails;
        expect(user).not.toBe(null);
        expect(user.id).toBe(newUserId);
        expect(user.email).toBe(userDetails.email);
        expect(user.firstName).toBe(userDetails.firstName);
        expect(user.lastName).toBe(userDetails.lastName);

        const updatedUserDetails: UserDetails = {
          id: newUserId as string,
          email: authDetails.email,
          firstName: "Dylan",
          lastName: "Jones",
        };

        const result = await updateUser(
          updatedUserDetails.id,
          updatedUserDetails.firstName,
          updatedUserDetails.lastName
        );

        expect(result).toBe(true);
      });
    });
  });

  describe("deleteUser", () => {
    describe("given user does not exist in table", () => {
      it("should throw an error", async () => {
        const userId = "94376268-1f12-4914-8f5e-c989bd4ee3b1";
        const result = await deleteUser(userId);
        expect(result).toBe(false);
      });
    });
    describe("given user does exist in table", () => {
      it("should return true", async () => {
        const authDetails: AuthDetails = {
          email: "bob@gmail.com",
          password: "password123",
        };
        const newUserId = await registerUser(authDetails);
        expect(newUserId).not.toBe(null);

        const userDetails: UserDetails = {
          id: newUserId as string,
          email: authDetails.email,
          firstName: "Bob",
          lastName: "Jenkins",
        };

        await addUserDetails(userDetails);

        const user = (await getUser(newUserId as string)) as UserDetails;
        expect(user).not.toBe(null);
        expect(user.id).toBe(newUserId);
        expect(user.email).toBe(userDetails.email);
        expect(user.firstName).toBe(userDetails.firstName);
        expect(user.lastName).toBe(userDetails.lastName);

        const result = await deleteUser(newUserId as string);

        expect(result).toBe(true);
      });
    });
  });
});

const teardown = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM users");
    await client.query("DELETE FROM auth");
    await client.query("COMMIT");
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};
