import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import SportResult from "App/Models/SportResult";

export default class extends BaseSeeder {
  public async run() {
    await SportResult.updateOrCreateMany("id", [
      {
        winner: "AWAY_TEAM",
        score: {
          home: 0,
          guest: 1,
        },
        participants: {
          home: "Santos",
          guest: "Palmeiras",
        },
        league: "BSA",
        startedDate: new Date().getTime() - 24 * 60 * 60 * 1000,
        matchId: undefined,
      },
      {
        winner: "HOME_TEAM",
        score: {
          home: 0,
          guest: 1,
        },
        participants: {
          home: "PSG",
          guest: "Arsenal",
        },
        league: "CL",
        startedDate: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
        matchId: undefined,
      },
    ]);
  }
}
