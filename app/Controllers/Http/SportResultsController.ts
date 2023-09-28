import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import League from "App/Models/League";
import Match from "App/Models/Match";
import SportBet from "App/Models/SportBet";
import SportResult from "App/Models/SportResult";
import SportResultValidator from "App/Validators/SportResultValidator";

export default class SportResultsController {
  public async createResult({
    auth,
    request,
    response,
    logger,
  }: HttpContextContract) {
    const user = await auth.use("api").authenticate();

    if (!user.is_admin) {
      return response.unauthorized();
    }

    try {
      const data = request.only([
        "winner",
        "score",
        "participants",
        "league",
        "started_date",
        "match_id",
      ]);

      await request.validate(SportResultValidator);

      const league = await League.findBy("shortName", data.league);

      if (!league) {
        return response.badRequest({
          message: "League not found, use league short name (BSA)",
        });
      }

      const match = await Match.findBy("id", data.match_id);

      const sportResult = await SportResult.create({
        winner: data.winner,
        score: data.score,
        participants: data.participants,
        league: league.shortName,
        startedDate: data.started_date,
        matchId: match?.id,
      });

      return response.created(sportResult);
    } catch (error) {
      logger.error("Error on create sport result %o", { error: error });
      return response.status(500).json({
        message: "Error on create sport result",
        error: error,
      });
    }
  }

  public async listResults({
    auth,
    params,
    response,
    logger,
  }: HttpContextContract) {
    const { league } = params;
    const user = await auth.use("api").authenticate();

    if (!user) {
      return response.unauthorized();
    }

    try {
      const sportResultsWithMatchIdQuery = SportResult.query()
        .where("league", league)
        .whereNotNull("matchId")
        .orderBy("createdAt", "desc");

      const sportResultsNullMatchIdQuery = SportResult.query()
        .where("league", league)
        .whereNull("matchId")
        .orderBy("createdAt", "desc");

      const [sportResultsWithMatchId, sportResultsNullMatchId] =
        await Promise.all([
          sportResultsWithMatchIdQuery.preload("match"),
          sportResultsNullMatchIdQuery.select("*"),
        ]);

      const sportBetPromises = sportResultsWithMatchId.map(async (result) => {
        const sportBet = await SportBet.query()
          .where("matchId", result.matchId)
          .where("userId", user.id)
          .first();
        return sportBet;
      });

      const sportBets = await Promise.all(sportBetPromises);

      const finalResults = sportResultsWithMatchId
        .concat(sportResultsNullMatchId)
        .map((result, index) => {
          return {
            result,
            sportBet: sportBets[index] || null,
          };
        });

      return response.ok(finalResults);
    } catch (error) {
      logger.error("Error on list sport results %o", { user: user.id });
      console.error(error);
      return response.internalServerError({
        message: "Error on list sport results",
      });
    }
  }
}
