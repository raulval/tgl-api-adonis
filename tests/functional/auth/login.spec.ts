import { test } from "@japa/runner";

test.group("Authentication", () => {
  const resource = "/login";

  test("should login with valid credentials", async ({ client }) => {
    const response = await client.post(resource).json({
      email: "admin@luby.com",
      password: "secret",
    });

    response.assertStatus(200);
  });

  test("should not login with invalid credentials", async ({ client }) => {
    const response = await client.post(resource).json({
      email: "test@email.com",
      password: "test",
    });
    response.assertStatus(401);
  });
});
