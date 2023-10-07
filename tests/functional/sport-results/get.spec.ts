import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("lottery result get", (group) => {
  group.tap((test) => test.tags(["@lottery_results_list"]));

  const resource = "/results/lottery/lotofacil";

  test("Should not list sport results if user not authorized", async ({
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

  test("Should list sport results", async ({ client }) => {
    const admin = await User.findOrFail(1);

    const response = await client.get(resource).loginAs(admin);

    response.assertStatus(200);
  });
});
