import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class MatchValidator {
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
    name: schema.string({ escape: true }),
    start_time: schema.number([
      rules.unsigned(),
      // rules.after("today")
    ]),
    participants: schema.object().members({
      home: schema.string({ escape: true }),
      guest: schema.string({ escape: true }),
    }),
    odds: schema.object().members({
      home: schema.number(),
      draw: schema.number(),
      guest: schema.number(),
    }),
    league_id: schema.number([rules.unsigned()]),
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
    required: "The {{ field }} is required to create a new match",
    "start_time.number": "Start time must be a timestamp (1695870000000)",
    "start_time.unsigned": "Start time must be a timestamp (1695870000000)",
  };
}
