import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("League create", (group) => {
  group.tap((test) => test.tags(["@league_create"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/admin/create-league";

  test("should create league with valid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client.post(resource).loginAs(admin).json({
      name: "Teste",
      short_name: "TST",
      start_date: "2021-05-01",
      end_date: "2022-05-01",
    });

    response.assertStatus(200);
  });

  test("should not create league with user not authorized", async ({
    client,
  }) => {
    const response = await client.post(resource);

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [
        {
          message: "E_UNAUTHORIZED_ACCESS: Unauthorized access",
        },
      ],
    });
  });

  test("should not create league with invalid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client.post(resource).loginAs(admin).json({
      name: "Teste",
      start_date: "2021-05-01",
      end_date: "2021-04-01",
    });

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          message: "The short_name is required to create a new league!",
        },
      ],
    });
  });
});
