import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import LotteryResult from "App/Models/LotteryResult";
import Game from "App/Models/Game";
import LotteryResultValidator from "App/Validators/LotteryResultValidator";

export default class LotteryResultsController {
  public async createResult({
    auth,
    request,
    response,
    logger,
  }: HttpContextContract) {
    const user = await auth.use("api").authenticate();

    const isAdmin = user?.is_admin;

    if (!user && !isAdmin) {
      return response.unauthorized();
    }

    try {
      const data = request.only([
        "name",
        "date",
        "contest",
        "numbers",
        "prizes",
        "totalPrize",
      ]);

      await request.validate(LotteryResultValidator);

      const game = await Game.findBy("type", data.name);

      if (!game) {
        return response.status(404).send({ message: "Name of game not found" });
      }

      const lotteryResult = await LotteryResult.create({
        name: data.name,
        date: data.date,
        contest: String(data.contest),
        numbers: JSON.stringify(data.numbers),
        prizes: JSON.stringify(data.prizes),
        totalPrize: data.totalPrize,
      });

      return response.created(lotteryResult);
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({
          message: error.messages.errors[0].message,
        });
      }
      logger.error("Error while creating lottery results: %o", {
        error: error,
      });
      return response.status(500).json({
        message: "Error while creating lottery results.",
        error: error,
      });
    }
  }

  public async getResults({
    auth,
    params,
    response,
    logger,
  }: HttpContextContract) {
    const user = await auth.use("api").authenticate();

    if (!user) {
      return response.unauthorized();
    }

    try {
      const { lottery } = params;

      const game = await Game.findBy("type", lottery);

      if (!game) {
        return response.status(404).send({ message: "Name of game not found" });
      }

      const lotteryResult = await LotteryResult.query()
        .where("name", lottery)
        .orderByRaw("STR_TO_DATE(date, '%d/%m/%Y') DESC")
        .firstOrFail();

      return response.ok({
        name: lotteryResult.name,
        date: lotteryResult.date,
        contest: lotteryResult.contest,
        numbers: lotteryResult.numbers,
        prizes: lotteryResult.prizes,
        totalPrize: lotteryResult.totalPrize,
        lotteryColor: game?.color,
      });
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({
          message: error.messages.errors[0].message,
        });
      }
      logger.error("Error while fetching lottery results.");
      return response.status(500).json({
        message: "Error while fetching lottery results.",
      });
    }
  }
}
