import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Match from "App/Models/Match";

export default class extends BaseSeeder {
  public async run() {
    await Match.updateOrCreateMany("id", [
      {
        id: 1,
        name: "Corinthians - São Paulo",
        startTime: new Date().getTime() + 24 * 60 * 60 * 1000,
        participants: {
          home: "Corinthians",
          guest: "São Paulo",
        },
        odds: {
          home: 3.1,
          draw: 2.3,
          guest: 1.7,
        },
        leagueId: 1,
      },
      {
        id: 2,
        name: "Real Madrid - Barcelona",
        startTime: new Date().getTime() + 2 * 24 * 60 * 60 * 1000,
        participants: {
          home: "Real Madrid",
          guest: "Barcelona",
        },
        odds: {
          home: 1.4,
          draw: 5.1,
          guest: 2.7,
        },
        leagueId: 2,
      },
    ]);
  }
}
