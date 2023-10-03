import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("League update", (group) => {
  group.tap((test) => test.tags(["@league_update"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/admin/update-league/1";

  test("should update league with valid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client.put(resource).loginAs(admin).json({
      end_date: "2023-05-01",
    });

    response.assertStatus(200);
  });

  test("should not update league with user not authorized", async ({
    client,
  }) => {
    const response = await client.put(resource);

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
