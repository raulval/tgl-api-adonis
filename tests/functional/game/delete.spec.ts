import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("Game delete", (group) => {
  group.tap((test) => test.tags(["@game_delete"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/admin/delete-game/1";

  test("should delete game with valid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client.delete(resource).loginAs(admin);

    response.assertStatus(200);
  });

  test("should not delete game with user not authorized", async ({
    client,
  }) => {
    const response = await client.delete(resource);

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
