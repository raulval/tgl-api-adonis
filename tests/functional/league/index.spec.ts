import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("League index", (group) => {
  group.tap((test) => test.tags(["@league_list"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/sports/leagues";

  test("should list all leagues", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client.get(resource).loginAs(admin);

    response.assertStatus(200);
  });

  test("should not list leagues with user not authorized", async ({
    client,
  }) => {
    const response = await client.get(resource);

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [
        {
          message: "E_UNAUTHORIZED_ACCESS: Unauthorized access",
        },
      ],
    });
  });
});
