import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import League from "App/Models/League";

export default class extends BaseSeeder {
  public async run() {
    await League.updateOrCreateMany("id", [
      {
        id: 1,
        name: "Brasileirão - Série A",
        startDate: "2023-04-15",
        endDate: "2023-12-03",
      },
      {
        id: 2,
        name: "UEFA Champions League",
        startDate: "2023-09-19",
        endDate: "2024-06-01",
      },
    ]);
  }
}
