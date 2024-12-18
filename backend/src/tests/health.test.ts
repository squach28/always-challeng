import { createServer } from "../utils/server";
import supertest from "supertest";
const app = createServer();

describe("GET /", () => {
  it("should return 200", async () => {
    await supertest(app).get("/").expect(200);
  });

  it("body should have property healthy", async () => {
    const result = await supertest(app).get("/");
    const data = await result.body;
    expect(data).toHaveProperty("healthy");
  });

  it("healthy should have value of true", async () => {
    const result = await supertest(app).get("/");
    const data = await result.body;
    expect(data.healthy).toBe(true);
  });
});
