import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("Create sport results", (group) => {
  group.tap((test) => test.tags(["@sport_results_create"]));

  const resource = "/admin/create-sport-result";

  test("Should not create sport result if user not authorized", async ({
    client,
  }) => {
    const response = await client.post(resource).json({
      winner: "HOME_TEAM",
      score: {
        home: 1,
        guest: 0,
      },
      participants: {
        home: "Team A",
        guest: "Team B",
      },
      league: "BSA",
      started_date: 1695927060000,
      match_id: 1,
    });

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [
        {
          message: "E_UNAUTHORIZED_ACCESS: Unauthorized access",
        },
      ],
    });
  });

  test("Should create sport result", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .json({
        winner: "HOME_TEAM",
        score: {
          home: 1,
          guest: 0,
        },
        participants: {
          home: "Team A",
          guest: "Team B",
        },
        league: "BSA",
        started_date: 1695927060000,
        match_id: 1,
      })
      .loginAs(admin);

    response.assertStatus(201);
  });
});
