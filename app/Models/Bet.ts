import { Filterable } from "@ioc:Adonis/Addons/LucidFilter";
import { compose } from "@ioc:Adonis/Core/Helpers";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import BetFilter from "./Filters/BetFilter";
import Game from "./Game";

export default class Bet extends compose(BaseModel, Filterable) {
  public static $filter = () => BetFilter;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public choosen_numbers: string;

  @column()
  public user_id: number;

  @column()
  public price: number;

  @column()
  public game_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Game, {
    foreignKey: "game_id",
  })
  public type: BelongsTo<typeof Game>;
}
