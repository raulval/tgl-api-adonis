import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SportBet from "App/Models/SportBet";
import SportResult from "App/Models/SportResult";

export default class SportResultsController {
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
