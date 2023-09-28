import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Match from "./Match";

export default class SportBet extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public matchId: number;

  @column()
  public userId: number;

  @column()
  public picked: string;

  @column()
  public odd: number;

  @column()
  public amount: number;

  @column()
  public earning: number;

  @column()
  public status: "pending" | "won" | "lost";

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Match, {
    foreignKey: "matchId",
  })
  public match: BelongsTo<typeof Match>;
}
