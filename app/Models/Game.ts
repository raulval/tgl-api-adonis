import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Bet from "./Bet";
import Cart from "./Cart";
import GameFilter from "./Filters/GameFilter";

export default class Game extends BaseModel {
  public static $filter = () => GameFilter;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public type: string;

  @column()
  public description: string;

  @column()
  public range: number;

  @column()
  public price: number;

  @column()
  public max_number: number;

  @column()
  public color: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Bet, {
    foreignKey: "game_id",
  })
  public games: HasMany<typeof Bet>;

  @belongsTo(() => Cart)
  public author: BelongsTo<typeof Cart>;
}
