import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

test.group("Create user", (group) => {
  group.tap((test) => test.tags(["@user_create"]));

  group.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/user/create";

  test("should create user with valid data", async ({ client }) => {
    const response = await client.post(resource).json({
      email: "teste@tgl.com",
      password: "secret",
      name: "Teste",
    });

    response.assertStatus(200);
  });

  test("should not create user with invalid email", async ({ client }) => {
    const response = await client.post(resource).json({
      email: "teste@tgl",
      password: "secret",
      name: "Teste",
    });

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          rule: "email",
          field: "email",
          message: "email validation failed",
        },
      ],
    });
  });

  test("should not create user with existed email", async ({ client }) => {
    const response = await client.post(resource).json({
      email: "teste@tgl.com",
      password: "secret",
      name: "Teste",
    });

    response.assertStatus(400);
    response.assertBodyContains({
      error: {
        message: "Email already exists",
      },
    });
  });

  test("should not create user with empty fields", async ({ client }) => {
    const response = await client.post(resource).json({
      email: "",
      password: "",
      name: "",
    });

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          rule: "required",
          field: "email",
          message: "The email is required to create a new account",
        },
        {
          rule: "required",
          field: "password",
          message: "The password is required to create a new account",
        },
        {
          rule: "required",
          field: "name",
          message: "The name is required to create a new account",
        },
      ],
    });
  });
});
