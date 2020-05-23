import request from "supertest";
import { app } from "../../../../../src/app";

interface IResponseBody {
  body: {
    success: boolean;
    data?: object[] | object;
    message?: string;
  };
}

describe("GET /api/users", () => {
  it("should get all users", async () => {
    const response: IResponseBody = await request(app)
      .get("/api/users")
      .expect(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toEqual(expect.any(Array));
  });
});
