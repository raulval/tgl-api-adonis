import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("User credits", (group) => {
  group.tap((test) => test.tags(["@user_credits"]));

  group.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource_create = "/user/create";
  const resource_get = "/user/my-account";

  test("should create user with 30 credits", async ({ client }) => {
    await client.post(resource_create).json({
      email: "teste@tgl.com",
      password: "secret",
      name: "Teste",
    });

    const user = await User.findByOrFail("email", "teste@tgl.com");

    const response = await client.get(resource_get).loginAs(user);

    response.assertStatus(200);
    response.assertBodyContains({
      credits: 30,
    });
  });
});
