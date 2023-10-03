import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("Match create", (group) => {
  group.tap((test) => test.tags(["@match_create"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/admin/create-match";

  test("should create match with valid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .loginAs(admin)
      .json({
        name: "Team A - Team B",
        start_time: 1695927060000,
        participants: {
          home: "Team A",
          guest: "Team B",
        },
        odds: {
          home: 1.5,
          draw: 3,
          guest: 2.5,
        },
        league_id: 1,
      });

    response.assertStatus(201);
  });

  test("should not create match with invalid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .loginAs(admin)
      .json({
        name: "Team A - Team B",
        participants: {
          home: "Team A",
          guest: "Team B",
        },
        odds: {
          home: 1.5,
          draw: 3,
          guest: 2.5,
        },
        league_id: 1,
      });

    response.assertStatus(422);
    response.assertBodyContains({
      message: "The start_time is required to create a new match",
    });
  });

  test("should not create match with unauthorized user", async ({ client }) => {
    const response = await client.post(resource).json({
      name: "Team A - Team B",
      start_time: 1695927060000,
      participants: {
        home: "Team A",
        guest: "Team B",
      },
      odds: {
        home: 1.5,
        draw: 3,
        guest: 2.5,
      },
      league_id: 1,
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

  test("should not create match with invalid league", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .json({
        name: "Team A - Team B",
        start_time: 1695927060000,
        participants: {
          home: "Team A",
          guest: "Team B",
        },
        odds: {
          home: 1.5,
          draw: 3,
          guest: 2.5,
        },
        league_id: 999,
      })
      .loginAs(admin);

    response.assertStatus(404);
    response.assertBodyContains({
      message: "League not found",
    });
  });
});
