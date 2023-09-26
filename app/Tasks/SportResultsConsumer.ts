import { BaseTask } from "adonis5-scheduler/build";
import Env from "@ioc:Adonis/Core/Env";
import Logger from "@ioc:Adonis/Core/Logger";
import axios from "axios";
import SportResult from "App/Models/SportResult";
import Match from "App/Models/Match";
import SportBet from "App/Models/SportBet";
import User from "App/Models/User";
import Database from "@ioc:Adonis/Lucid/Database";
let dice = require("fast-dice-coefficient");

export default class SportResultsConsumer extends BaseTask {
  private BASE_URL = Env.get("SPORT_RESULTS_BASE_URL");
  private API_KEY = Env.get("SPORT_RESULTS_API_KEY");
  private similarityThreshold = 0.35;
  public static get schedule() {
    return "*/10 10-23 * * *"; // Each 10 minutes from 10am to 11pm
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false;
  }

  public async handle() {
    const dateTo = new Date().toISOString().split("T")[0];
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 5); // 5 days ago
    const formattedDateFrom = dateFrom.toISOString().split("T")[0];

    const competitions = ["BSA", "CL"];
    const status = "FINISHED";

    try {
      const response = await axios.get(this.BASE_URL, {
        params: {
          dateFrom: formattedDateFrom,
          dateTo: dateTo,
          competitions: competitions.join(","),
          status,
        },
        headers: {
          "X-Auth-Token": this.API_KEY,
        },
      });

      const results = response.data.matches;

      const resultsPromises = results.map(async (result) => {
        const {
          id,
          score: { winner },
          score: { fullTime },
          competition,
          homeTeam,
          awayTeam,
          utcDate,
        } = result;

        const matches = await Match.query().where(
          "startTime",
          new Date(utcDate).getTime()
        );

        let matchId: string | undefined = undefined;

        if (matches && matches.length > 1) {
          const similaritiesHome = matches.map((match) => {
            const similarity = dice(
              match.participants.home.toLowerCase(),
              homeTeam.shortName.toLowerCase()
            );
            return similarity;
          });

          const similaritiesGuest = matches.map((match) => {
            const similarity = dice(
              match.participants.guest.toLowerCase(),
              awayTeam.shortName.toLowerCase()
            );
            return similarity;
          });

          const maxSimilarityHome = Math.max(...similaritiesHome);
          const maxSimilarityGuest = Math.max(...similaritiesGuest);

          if (
            maxSimilarityHome > this.similarityThreshold ||
            maxSimilarityGuest > this.similarityThreshold
          ) {
            if (maxSimilarityHome > maxSimilarityGuest) {
              const indexHome = similaritiesHome.indexOf(maxSimilarityHome);
              matchId = matches[indexHome].id;
            } else if (maxSimilarityGuest > maxSimilarityHome) {
              const indexGuest = similaritiesGuest.indexOf(maxSimilarityGuest);
              matchId = matches[indexGuest].id;
            } else if (maxSimilarityHome === maxSimilarityGuest) {
              const indexHome = similaritiesHome.indexOf(maxSimilarityHome);
              matchId = matches[indexHome].id;
            }
          }
        } else if (matches && matches.length === 1) {
          matchId = matches[0].id;
        }

        const sportResult = await SportResult.updateOrCreate(
          { id },
          {
            winner,
            score: {
              home: fullTime.home,
              guest: fullTime.away,
            },
            participants: {
              home: homeTeam.shortName,
              guest: awayTeam.shortName,
            },
            league: competition.code,
            startedDate: new Date(utcDate).getTime(),
            matchId,
          }
        );

        return sportResult;
      });

      await Promise.all(resultsPromises);
      Logger.info("Sport results saved successfully");
    } catch (error) {
      Logger.error("Error updating sport results:");
      console.log(error);
    }

    try {
      await Database.transaction(async (trx) => {
        const winningBets = await SportBet.query()
          .where("status", "pending")
          .whereNotNull("matchId")
          .useTransaction(trx);

        for (const bet of winningBets) {
          const sportResult = await SportResult.findBy(
            "matchId",
            bet.matchId,
            trx
          );
          if (!sportResult) continue;
          const match = await Match.findByOrFail("id", bet.matchId, trx);

          if (
            sportResult &&
            ((sportResult.winner === "HOME_TEAM" &&
              bet.picked === match?.participants.home) ||
              (sportResult.winner === "AWAY_TEAM" &&
                bet.picked === match?.participants.guest) ||
              (sportResult.winner === "DRAW" && bet.picked === "draw"))
          ) {
            Logger.info("Bet paid: %o", {
              user: bet.userId,
              amount: bet.earning,
            });

            const user = await User.findOrFail(bet.userId, trx);
            user.credits += bet.earning;
            await user.save();

            bet.status = "won";
            await bet.save();
          } else {
            bet.status = "lost";
            await bet.save();
          }
        }

        trx.commit();
      });

      Logger.info("Sport Bets paid successfully");
    } catch (error) {
      Logger.error("Error paying sport bets:");
      console.log(error);
    }
  }
}
