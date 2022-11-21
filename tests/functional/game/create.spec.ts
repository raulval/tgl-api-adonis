import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("Create game", (group) => {
  group.tap((test) => test.tags(["@game_create"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/admin/create-game";

  test("should create game with valid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .json({
        type: "Lotoeasy",
        description: "Escolha 15 números para apostar na lotofácil.",
        range: 25,
        price: 2.5,
        max_number: 15,
        color: "#7F3728",
      })
      .loginAs(admin);

    response.assertStatus(200);
  });

  test("should not create game with user not authorized", async ({
    client,
  }) => {
    const response = await client.post(resource).json({
      type: "Lotoeasy",
      description: "Escolha 15 números para apostar na lotofácil.",
      range: 25,
      price: 2.5,
      max_number: 15,
      color: "#7F3728",
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

  test("should not create game with null type", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .json({
        type: "",
        description: "Escolha 15 números para apostar na lotofácil.",
        range: 25,
        price: 2.5,
        max_number: 15,
        color: "#7F3728",
      })
      .loginAs(admin);

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          rule: "required",
          field: "type",
          message: "The type is required to create a new game!",
        },
      ],
    });
  });
});
