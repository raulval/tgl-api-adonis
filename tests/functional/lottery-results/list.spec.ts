import { test } from "@japa/runner";
import Match from "App/Models/Match";
import SportResult from "App/Models/SportResult";
import User from "App/Models/User";

test.group("Sport results list", (group) => {
  group.tap((test) => test.tags(["@sport_results_list"]));

  const resource = "/results/sports/BSA";

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
      startTime: 1695927060000,
      leagueId: 1,
    });

    return match;
  };
  const createSportResult = async () => {
    const result = await SportResult.create({
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
      startedDate: 1695927060000,
      matchId: 100,
    });
    return result;
  };

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

    await createMatch();
    await createSportResult();

    const response = await client.get(resource).loginAs(admin);

    response.assertStatus(200);
  });
});
