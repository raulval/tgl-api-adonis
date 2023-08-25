import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Game from "App/Models/Game";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    await Game.updateOrCreateMany("type", [
      {
        type: "Lotofácil",
        description:
          "Choose 15 numbers to bet on Lotofácil. You win by matching 11, 12, 13, 14, or 15 numbers. There are many chances to win, and now you can play from wherever you are!",
        range: 25,
        price: 3,
        max_number: 15,
        color: "#7F3992",
      },
      {
        type: "Mega-Sena",
        description:
          "Choose 6 numbers out of the 60 available in Mega-Sena. Win with 6, 5, or 4 matches. Two weekly draws are held for you to bet and hope to become a millionaire.",
        range: 60,
        price: 5,
        max_number: 6,
        color: "#01AC66",
      },
      {
        type: "Quina",
        description:
          "Select 5 numbers from the 80 available in Quina. Win with 5, 4, 3, or 2 matches. There are six weekly draws and six chances to win.",
        range: 80,
        price: 2,
        max_number: 5,
        color: "#F79C31",
      },
    ]);
  }
}
