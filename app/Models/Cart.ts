import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Game from "./Game";

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public minCartValue: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Game)
  public games: HasMany<typeof Game>;
}
