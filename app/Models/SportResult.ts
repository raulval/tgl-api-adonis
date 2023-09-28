import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Match from "./Match";

export default class SportResult extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public winner: "HOME_TEAM" | "DRAW" | "AWAY_TEAM";

  @column()
  public score: { home: number; guest: number };

  @column()
  public participants: { home: string; guest: string };

  @column()
  public league: string;

  @column()
  public startedDate: number;

  @column()
  public matchId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Match, {
    foreignKey: "matchId",
  })
  public match: BelongsTo<typeof Match>;
}
