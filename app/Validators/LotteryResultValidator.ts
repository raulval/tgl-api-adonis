import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class LotteryResultValidator {
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
    name: schema.string({}, [rules.minLength(3)]),
    date: schema.string({}, [
      rules.regex(
        /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/
      ),
    ]),
    contest: schema.number(),
    numbers: schema.array().members(schema.number()),
    prizes: schema.array().members(
      schema.object().members({
        prize: schema.string({}, [
          rules.regex(/^R\$ \d{1,3}(?:\.\d{3})*(?:,\d{2})$/),
        ]),
        scores: schema.string(),
        winners: schema.number(),
      })
    ),
    totalPrize: schema.string({}, [
      rules.regex(/^R\$ ([1-9]\d{0,2}(?:\.\d{1,2})?|[1-9]\d*\.?\d{1,2})$/),
    ]),
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
    required: "{{ field }} is required",
    minLength:
      "{{ field }} must be at least {{ options.minLength }} characters",
    "date.regex": "{{ field }} must be a valid date (dd/mm/yyyy)",
    "contest.number": "{{ field }} must be a number",
    "numbers.array": "{{field}} must be an array of numbers",
    "prizes.array":
      "{{field}} must be an array of objects { prize: string, scores: string, winners: number }",
    "totalPrize.regex":
      "{{field}} must be a valid cash prize in millions (R$ 6.5)",
  };
}
