import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import Match from "App/Models/Match";
import User from "App/Models/User";

test.group("Match list", (group) => {
  group.tap((test) => test.tags(["@match_list"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/sports/matches";

  const createMatch = async () => {
    const match = await Match.create({
      id: 100,
      name: "Team A - Team B",
      participants: {
        home: "Team A",
        guest: "Team B",
      },
      odds: {
        home: 1.5,
        draw: 3,
        guest: 4.1,
      },
      startTime: new Date().getTime() + 60 * 60 * 1000,
      leagueId: 1,
    });

    return match;
  };

  test("should list all matches", async ({ client }) => {
    await createMatch();
    const admin = await User.findOrFail(1);
    const response = await client
      .get(resource)
      .loginAs(admin)
      .qs({ league: "BSA" });

    response.assertStatus(200);
  });

  test("should not list all matches if unauthorized user", async ({
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
