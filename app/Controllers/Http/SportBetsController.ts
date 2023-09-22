import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Match from "App/Models/Match";
import SportBet from "App/Models/SportBet";

export default class SportBetsController {
  public async createSportBet({
    request,
    auth,
    response,
    logger,
  }: HttpContextContract) {
    const user = await auth.use("api").authenticate();

    if (!user) {
      return response.status(401).send({ message: "User not authenticated" });
    }
    try {
      const data = request.only(["match_id", "picked", "odd", "amount"]);

      const match = await Match.findBy("id", data.match_id);

      const bet = await SportBet.findBy("match_id", data.match_id);

      if (bet) {
        return response.status(400).send({
          message: "You have already betted on this match",
        });
      }

      if (!match) {
        return response.status(404).send({ message: "Match not found" });
      }

      if (match.startTime <= new Date().getTime()) {
        return response.status(400).send({
          message: "You cannot bet on a match that has already started",
        });
      }

      if (user.credits < data.amount) {
        return response.badRequest({ message: "Insufficient credits" });
      }

      const earning = data.odd * data.amount;

      const sportBet = new SportBet();
      sportBet.matchId = data.match_id;
      sportBet.userId = user.id;
      sportBet.picked = data.picked;
      sportBet.odd = data.odd;
      sportBet.amount = data.amount;
      sportBet.earning = earning;

      await sportBet.save();
      user.credits -= data.amount;
      await user.save();

      return response
        .status(201)
        .send({ sportBet, match, credits: user.credits });
    } catch (error) {
      logger.error("Error on create sport bet %o", { user: user.id });
      return response
        .status(500)
        .send({ message: "Error on create sport bet" });
    }
  }

  public async listSportBets({
    auth,
    response,
    request,
    logger,
  }: HttpContextContract) {
    const user = await auth.use("api").authenticate();

    if (!user) {
      return response.unauthorized();
    }
    try {
      const sportBetsQuery = SportBet.query()
        .where("userId", user.id)
        .preload("match", (query) => {
          query.orderBy("createdAt", "desc");
        });

      const leagues = request.qs().league;

      if (leagues) {
        sportBetsQuery.whereHas("match", (query) => {
          query.whereHas("league", (query) => {
            query.whereIn("shortName", leagues);
          });
        });
      }

      const sportBets = await sportBetsQuery;

      return response.ok(sportBets);
    } catch (error) {
      logger.error("Error on create sport bet %o", { user: user.id });
      return response.internalServerError({
        message: "Error on list sport bets",
      });
    }
  }
}
