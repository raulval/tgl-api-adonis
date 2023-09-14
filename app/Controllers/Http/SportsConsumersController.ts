import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";
import * as cheerio from "cheerio";
import Match from "App/Models/Match";
import League from "App/Models/League";

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

export default class SportsConsumersController {
  private getUserAgent(): string {
    return (
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    );
  }

  private async fetchMatchesData(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": this.getUserAgent() },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error while fetching sports matches.");
    }
  }

  private async updateOrCreateMatch(
    matchData: Event,
    leagueId: number
  ): Promise<Match> {
    const existingMatch = await Match.find(matchData.id);
    const odds = {
      home: matchData.markets[0]?.selections?.[0]?.price || 0,
      draw: matchData.markets[0]?.selections?.[1]?.price || 0,
      guest: matchData.markets[0]?.selections?.[2]?.price || 0,
    };

    if (existingMatch) {
      existingMatch.odds = odds;
      existingMatch.startTime = matchData.startTime;
      existingMatch.participants = {
        home: matchData.participants[0]?.name,
        guest: matchData.participants[1]?.name,
      };
      existingMatch.merge(existingMatch);
      // await existingMatch.save();
      return existingMatch;
    } else {
      const newMatch = new Match();
      newMatch.id = matchData.id;
      newMatch.name = matchData.name;
      newMatch.startTime = matchData.startTime;
      newMatch.participants = {
        home: matchData.participants[0]?.name || "N/A",
        guest: matchData.participants[1]?.name || "N/A",
      };
      newMatch.odds = odds;
      newMatch.leagueId = leagueId;
      await newMatch.save();
      return newMatch;
    }
  }

  public async getMatches({ request, response }: HttpContextContract) {
    const league: string = request.qs().league;
    const BASE_URL = Env.get(`SPORTS_${league}_BASE_URL`);

    if (!BASE_URL) {
      return response.status(500).json({
        message: "Base URL not configured.",
      });
    }

    try {
      const matchesData = await this.fetchMatchesData(BASE_URL);
      const $ = cheerio.load(matchesData);

      const jsonText = $(
        'script:contains("window[\\"initial_state\\"]")'
      ).text();
      const cleanedJson = jsonText.replace('window["initial_state"]=', "");
      const { data }: IMatch = JSON.parse(cleanedJson);

      if (!data || !data.blocks || !data.blocks[0] || !data.blocks[0].events) {
        return response.status(500).json({
          message: "Data structure is invalid or incomplete.",
        });
      }

      const leagueId = (await League.findByOrFail("shortName", league)).id;

      const matches = data.blocks[0].events.map(async (match: Event) => {
        try {
          const savedMatch = await this.updateOrCreateMatch(match, leagueId);
          return savedMatch;
        } catch (error) {
          console.error(error);
          return response.status(500).json({
            message: "Error while fetching and updating sports matches.",
          });
        }
      });

      const savedMatches = await Promise.all(matches);

      return { matches: savedMatches.filter((match) => !!match) };
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: "Error while fetching and updating sports matches.",
      });
    }
  }
}
