import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";
import { bets } from "App/Services/betsTestHelper";

test.group("Create lottery bet", (group) => {
  group.tap((test) => test.tags(["@lottery_bet_create"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/bet/new-bet";

  test("should create bet with valid data and min cart value", async ({
    client,
  }) => {
    const admin = await User.findOrFail(1);

    const response = await client.post(resource).json(bets).loginAs(admin);

    response.assertStatus(200);
  });

  test("should not create bet with user not authorized", async ({ client }) => {
    const response = await client.post(resource).json(bets);

    response.assertStatus(401);
    response.assertBodyContains({
      errors: [
        {
          message: "E_UNAUTHORIZED_ACCESS: Unauthorized access",
        },
      ],
    });
  });

  test("should not create bet with value below min cart value", async ({
    client,
  }) => {
    const admin = await User.findOrFail(1);

    const response = await client
      .post(resource)
      .json({
        games: [
          {
            game_id: 1,
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15],
          },
        ],
      })
      .loginAs(admin);

    response.assertStatus(400);
    response.assertBodyContains({
      message: "The value min authorized is 10,00",
    });
  });
});
