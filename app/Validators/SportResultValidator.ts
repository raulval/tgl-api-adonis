import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SportResultValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    winner: schema.enum(["HOME_TEAM", "DRAW", "AWAY_TEAM"]),
    score: schema.object().members({
      home: schema.number(),
      guest: schema.number(),
    }),
    participants: schema.object().members({
      home: schema.string({ escape: true }),
      guest: schema.string({ escape: true }),
    }),
    league: schema.string({ escape: false }),
    started_date: schema.number([rules.unsigned()]),
    match_id: schema.number([rules.unsigned()]),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    required: "The {{ field }} is required to create a new sport result",
    "score.*.number": "Score must be a number",
    "started_date.number": "Started date must be a timestamp (1695870000000)",
    "started_date.unsigned": "Started date must be a timestamp (1695870000000)",
    "league.escape": "League short name is required",
    enum: "Winner must be HOME_TEAM, DRAW or AWAY_TEAM",
  };
}
