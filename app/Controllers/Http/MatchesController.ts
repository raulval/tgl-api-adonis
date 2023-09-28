import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Match from "App/Models/Match";
import League from "App/Models/League";
import MatchValidator from "App/Validators/MatchValidator";

interface IMatch {
  data: Data;
}

interface Data {
  blocks: Block[];
}

interface Block {
  shortName: string;
  events: Event[];
}

interface Event {
  sportId: string;
  shortName: string;
  totalMarketsAvailable: number;
  regionName: string;
  leagueDescription: string;
  id: string;
  name: string;
  startTime: number;
  markets: Market[];
  participants: Participant[];
}

interface Market {
  id: string;
  uniqueId: string;
  name: string;
  type: string;
  handicap: number;
  marketCloseTimeMillis: number;
  renderingLayout: number;
  selections: Selection[];
}

interface Selection {
  id: string;
  name: string;
  fullName?: string;
  shortName: string;
  price: number;
}

interface Participant {
  name: string;
}

export default class MatchesController {
  public async createMatch({
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
        "name",
        "start_time",
        "participants",
        "odds",
        "league_id",
      ]);
      await request.validate(MatchValidator);

      const league = await League.findBy("id", data.league_id);

      if (!league) {
        return response.status(404).send({ message: "League not found" });
      }

      const match = await Match.create({
        name: data.name,
        startTime: data.start_time,
        participants: data.participants,
        odds: data.odds,
        leagueId: league.id,
      });

      return response.created(match);
    } catch (error) {
      logger.error("Error while creating sports matches: %o", { error: error });
      return response.status(500).json({
        message: "Error while creating sports matches.",
        error: error,
      });
    }
  }

  public async listMatches({ request, response, logger }: HttpContextContract) {
    const league: number = request.qs().league;

    try {
      const leagueId = (await League.findByOrFail("shortName", league)).id;

      const matches = await Match.query()
        .where("leagueId", leagueId)
        .where("startTime", ">=", new Date().getTime() - 1 * 60 * 60 * 1000)
        .orderBy("startTime", "asc");

      return response.ok({ matches });
    } catch (error) {
      logger.error("Error while fetching sports matches.");
      console.error(error.code);
      return response.status(500).json({
        message: "Error while fetching sports matches.",
      });
    }
  }
}
