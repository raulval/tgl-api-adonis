import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import Match from "App/Models/Match";
import User from "App/Models/User";

test.group("Create sport bet", (group) => {
  group.tap((test) => test.tags(["@sport_bet_create"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/sports/new-bet";

  const createMatch = async () => {
    const match = await Match.create({
      id: 120,
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

  const createStartedMatch = async () => {
    const match = await Match.create({
      id: 999,
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
      startTime: new Date().getTime() - 60 * 1000,
      leagueId: 1,
    });

    return match;
  };

  test("Should not create sport bet with user not authorized", async ({
    client,
  }) => {
    const response = await client.post(resource).json({
      match_id: 1,
      picked: "Team A",
      odd: 1.5,
      amount: 10,
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

  test("Should not create sport bet with insufficient credits", async ({
    client,
  }) => {
    const admin = await User.findOrFail(1);

    await createMatch();

    const response = await client
      .post(resource)
      .json({
        match_id: 120,
        picked: "Team A",
        odd: 1.5,
        amount: 200,
      })
      .loginAs(admin);

    response.assertStatus(400);
    response.assertBodyContains({
      message: "Insufficient credits",
    });
  });

  test("Should not create sport bet twice in the same match", async ({
    client,
  }) => {
    const admin = await User.findOrFail(1);

    await createMatch();

    await client
      .post(resource)
      .json({
        match_id: 120,
        picked: "Team A",
        odd: 1.5,
        amount: 1,
      })
      .loginAs(admin);

    const response = await client
      .post(resource)
      .json({
        match_id: 120,
        picked: "Team A",
        odd: 1.5,
        amount: 1,
      })
      .loginAs(admin);

    response.assertStatus(400);
    response.assertBodyContains({
      message: "You have already betted on this match",
    });
  });

  test("Should create sport bet with enough credits", async ({ client }) => {
    const admin = await User.findOrFail(1);

    await createMatch();

    const response = await client
      .post(resource)
      .json({
        match_id: 120,
        picked: "Team A",
        odd: 1.5,
        amount: 10,
      })
      .loginAs(admin);

    response.assertStatus(201);
  });

  test("Should no create sport bet in a match that has started", async ({
    client,
  }) => {
    const admin = await User.findOrFail(1);

    await createStartedMatch();

    const response = await client
      .post(resource)
      .json({
        match_id: 999,
        picked: "Team A",
        odd: 1.5,
        amount: 1,
      })
      .loginAs(admin);

    response.assertStatus(400);
    response.assertBodyContains({
      message: "You cannot bet on a match that has already started",
    });
  });
});
