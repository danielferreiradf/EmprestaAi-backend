import request from "supertest";
import { app } from "../../../../../src/app";
import { IResponseBody } from "../../../../app/interfaces/controllers.types";

describe("POST /api/users", () => {
  const mockUser = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    password: "123456",
    address: "some street",
    city: "New York",
    state: "New York",
    cep: "123456",
    phone: "123456",
  };

  it("should create an user", async () => {
    const response: IResponseBody = await request(app)
      .post("/api/users")
      .send(mockUser)
      .expect(200);

    console.log(response.body);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toEqual(expect.any(Object));
  });
});
