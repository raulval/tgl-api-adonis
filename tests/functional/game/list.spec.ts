import { test } from "@japa/runner";

test.group("Game list", (group) => {
  group.tap((test) => test.tags(["@game_list"]));

  const resource = "/cart_games";

  test("should list all games", async ({ client }) => {
    const response = await client.get(resource);

    response.assertStatus(200);
  });
});
