import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import axios from "axios";
import { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";
import LotteryResult from "App/Models/LotteryResult";
import Database from "@ioc:Adonis/Lucid/Database";
import Game from "App/Models/Game";

export default class LotteryConsumersController {
  private BASE_URL = "https://www.lotericapremiada.com.br/";

  public async getResults({ params, response }: HttpContextContract) {
    const { lottery } = params;

    const url = `${this.BASE_URL}resultados-${lottery}`;

    try {
      const { data: resultData } = await axios.get(url);

      const $ = cheerio.load(resultData);

      const name = this.extractLottoName($);
      const date = this.extractLottoDate($);
      const contest = this.extractLottoContest($);
      const numbers = this.extractLottoNumbers($);
      const prizes = this.extractLottoPrizes($);
      const totalPrize = this.extractTotalPrize($);

      const game = await Game.findBy("type", name);

      await Database.transaction(async (trx) => {
        const existingResult = await LotteryResult.findBy(
          "contest",
          contest,
          trx
        );

        if (!existingResult || existingResult.date !== date) {
          await LotteryResult.create(
            {
              name,
              date,
              contest,
              numbers: JSON.stringify(numbers),
              prizes: JSON.stringify(prizes),
              totalPrize,
            },
            trx
          );
        }
      });

      return {
        name,
        date,
        contest,
        numbers,
        prizes,
        totalPrize,
        lotteryColor: game?.color,
      };
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: "Error while fetching lottery results.",
      });
    }
  }

  private extractLottoName($: CheerioAPI): string {
    return $(".h1-resultado")
      .text()
      .replace(/^Resultado da\s/, "") === "Mega Sena"
      ? "Mega-Sena"
      : $(".h1-resultado")
          .text()
          .replace(/^Resultado da\s/, "");
  }

  private extractLottoDate($: CheerioAPI): string {
    return $(".premio-estimate p").text().split(":")[1].trim();
  }

  private extractLottoContest($: CheerioAPI): string {
    return $(".valor-estimate p").text().trim();
  }

  private extractLottoNumbers($: CheerioAPI): number[] {
    return $("#h2-numeros-resultados")
      .get()
      .map((element) => Number($(element).text()));
  }

  private extractLottoPrizes($: CheerioAPI): any[] {
    return $("#table-resultados tbody tr")
      .get()
      .map((row) => {
        const row$ = $(row);
        return {
          scores: row$.find("td").eq(0).text().trim().replace(" Pontos", ""),
          winners: parseInt(row$.find("td").eq(1).text()),
          prize: row$.find("td").eq(2).text().trim(),
        };
      });
  }

  private extractTotalPrize($: CheerioAPI): string {
    return $(".valor-premio-banner").text().replace(" Milhões", "").trim();
  }
}
