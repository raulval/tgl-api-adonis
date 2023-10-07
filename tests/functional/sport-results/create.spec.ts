import { test } from "@japa/runner";
import User from "App/Models/User";

test.group("Create lottery results", (group) => {
  group.tap((test) => test.tags(["@lottery_results_create"]));

  const resource = "/admin/create-lottery-result";

  test("Should not create lottery result if user not authorized", async ({
    client,
  }) => {
    const response = await client.post(resource).json({
      name: "Lotofácil",
      date: "02/10/2023",
      contest: "2910",
      numbers: "[1, 2, 6, 7, 8, 9, 10, 13, 15, 18, 19, 20, 21, 23, 24]",
      prizes:
        "[{prize: R$ 4.053.915,54, scores: 15, winners: 2}, {scores: 14, winners: 388, prize: R$ 1.914,62}, {scores: 13, winners: 15045, prize: R$ 30,00}, {scores: 12, winners: 198087, prize: R$ 12,00}, {scores: 11, winners: 1166438, prize: R$ 6,00}]",
      totalPrize: "R$ 6.5",
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

  test("Should not create lottery result if body is invalid", async ({
    client,
  }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .json({
        name: "Lotofácil",
        date: "02/10/2023",
        contest: "2910",
        numbers: "1, 2, 6, 7, 8, 9, 10, 13, 15, 18, 19, 20, 21, 23, 24",
        prizes:
          "[{prize: R$ 4.053.915,54, scores: 15, winners: 2}, {scores: 14, winners: 388, prize: R$ 1.914,62}, {scores: 13, winners: 15045, prize: R$ 30,00}, {scores: 12, winners: 198087, prize: R$ 12,00}, {scores: 11, winners: 1166438, prize: R$ 6,00}]",
        totalPrize: "R$ 6.5",
      })
      .loginAs(admin);

    response.assertStatus(422);
  });

  test("Should create lottery result", async ({ client }) => {
    const admin = await User.findOrFail(1);
    const response = await client
      .post(resource)
      .json({
        name: "Lotofácil",
        date: "02/10/2023",
        contest: "2910",
        numbers: [1, 2, 6, 7, 8, 9, 10, 13, 15, 18, 19, 20, 21, 23, 24],
        prizes: [
          { prize: "R$ 4.053.915,54", scores: "15", winners: 2 },
          { prize: "R$ 1.914,62", scores: "14", winners: 388 },
          { prize: "R$ 30,00", scores: "13", winners: 15045 },
          { prize: "R$ 12,00", scores: "12", winners: 198087 },
          { prize: "R$ 6,00", scores: "11", winners: 1166438 },
        ],
        totalPrize: "R$ 6.5",
      })
      .loginAs(admin);

    response.assertStatus(201);
  });
});
