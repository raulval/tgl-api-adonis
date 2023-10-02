import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("List sport bets", (group) => {
  group.tap((test) => test.tags(["@sport_bet_list"]));

  const resource = "sports/bets";

  test("Should not list all sport bets if user not authorized", async ({
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

  test("Should list all sport bets", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client.get(resource).loginAs(admin);

    response.assertStatus(200);
  });
});
