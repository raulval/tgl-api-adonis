import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Game from "App/Models/Game";
import GameValidator from "App/Validators/GameValidator";
import UpdateGameValidator from "App/Validators/UpdateGameValidator";

export default class GamesController {
  public async create({ request }: HttpContextContract) {
    const game = request.only([
      "type",
      "description",
      "range",
      "price",
      "max_number",
      "color",
    ]);
    await request.validate(GameValidator);

    await Game.create(game);
    return game;
  }

  public async index() {
    const games = await Game.query().select("*");
    return games;
  }

  public async update({ request }: HttpContextContract) {
    const { gameId } = request.params();
    const updated = request.only([
      "type",
      "description",
      "range",
      "price",
      "max_number",
      "color",
    ]);
    await request.validate(UpdateGameValidator);

    const game = await Game.findByOrFail("id", gameId);

    await game.merge(updated);
    await game.save();

    return game;
  }

  public async delete({ request }: HttpContextContract) {
    const { gameId } = request.params();

    const game = await Game.findByOrFail("id", gameId);

    await game.delete();

    return "You can create a new game to substitute the last one!";
  }
}
