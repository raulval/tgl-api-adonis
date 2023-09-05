import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class LotteryResult extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public date: string;

  @column()
  public contest: string;

  @column()
  public numbers: string;

  @column()
  public prizes: string;

  @column()
  public totalPrize: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}

export class Prize {
  scores: string;
  winners: number;
  prize: string;

  constructor(scores: string, winners: number, prize: string) {
    this.scores = scores;
    this.winners = winners;
    this.prize = prize;
  }
}
