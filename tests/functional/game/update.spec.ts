import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("Game update", (group) => {
  group.tap((test) => test.tags(["@game_update"]));

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  const resource = "/admin/update-game/1";

  test("should update game with valid data", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .put(resource)
      .json({
        type: "Timemania",
        description:
          "Escolha 10 números para apostar na Timemania. Você ganha acertando 7, 6, 5, 4 ou 3 números. São muitas chances de ganhar, e agora você joga de onde estiver!",
        range: 80,
        price: 2,
        max_number: 10,
        color: "#44414a",
      })
      .loginAs(admin);

    response.assertStatus(200);
  });

  test("should not update game with user not authorized", async ({
    client,
  }) => {
    const response = await client.put(resource).json({
      type: "Timemania",
      description:
        "Escolha 10 números para apostar na Timemania. Você ganha acertando 7, 6, 5, 4 ou 3 números. São muitas chances de ganhar, e agora você joga de onde estiver!",
      range: 80,
      price: 2,
      max_number: 10,
      color: "#44414a",
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
});
