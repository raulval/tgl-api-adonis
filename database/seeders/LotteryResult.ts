import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import LotteryResult from "App/Models/LotteryResult";

export default class extends BaseSeeder {
  public async run() {
    await LotteryResult.updateOrCreateMany("id", [
      {
        id: 1,
        name: "Lotofácil",
        date: "02/10/2023",
        contest: "2910",
        numbers: "[1, 2, 6, 7, 8, 9, 10, 13, 15, 18, 19, 20, 21, 23, 24]",
        prizes:
          '[{"prize": "R$ 4.053.915,54", "scores": "15", "winners": 2}, {"prize": "R$ 1.914,62", "scores": "14", "winners": 388}, {"prize": "R$ 30,00", "scores": "13", "winners": 15045}, {"prize": "R$ 12,00", "scores": "12", "winners": 198087}, {"prize": "R$ 6,00", "scores": "11", "winners": 1166438}]',
        totalPrize: "R$ 6.5",
      },
      {
        id: 2,
        name: "Mega-Sena",
        date: "02/10/2023",
        contest: "4910",
        numbers: "[6, 11, 29, 37, 56, 58]",
        prizes:
          '[{"prize": "R$ 0,00", "scores": "Sena", "winners": 0}, {"prize": "R$ 45.524,71", "scores": "Quina", "winners": 58}, {"prize": "R$ 1.039,99", "scores": "Quadra", "winners": 3}]',
        totalPrize: "R$ 40",
      },
      {
        id: 3,
        name: "Quina",
        date: "02/10/2023",
        contest: "6248",
        numbers: "[8, 12, 16, 20, 64]",
        prizes:
          '[{"prize": "R$ 0,00", "scores": "Quina", "winners": 0}, {"prize": "R$ 3.751,15", "scores": "Quadra", "winners": 93}, {"prize": "R$ 63,85", "scores": "Terno", "winners": 5}, {"prize": "R$ 3,29", "scores": "Duque", "winners": 100}]',
        totalPrize: "R$ 3",
      },
    ]);
  }
}
