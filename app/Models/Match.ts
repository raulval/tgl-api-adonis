import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import League from "./League";
import SportBet from "./SportBet";
import SportResult from "./SportResult";

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public startTime: number;

  @column()
  public participants: { home: string; guest: string };

  @column()
  public odds: { home: number; draw: number; guest: number };

  @column()
  public leagueId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => League, {
    foreignKey: "leagueId",
  })
  public league: BelongsTo<typeof League>;

  @hasMany(() => SportBet, {
    foreignKey: "matchId",
  })
  public sportBet: HasMany<typeof SportBet>;

  @hasOne(() => SportResult, {
    foreignKey: "matchId",
  })
  public sportResult: HasOne<typeof SportResult>;
}
