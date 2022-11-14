import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { CustomMessages, rules, schema } from "@ioc:Adonis/Core/Validator";

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.auth.user?.id,
  });

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
    email: schema.string.optional({ trim: true }, [
      rules.requiredWhen("email", "=", ""),
      rules.email(),
      rules.unique({
        table: "users",
        column: "email",
        caseInsensitive: true,
        whereNot: {
          id: this.refs.id,
        },
      }),
    ]),
    password: schema.string.optional({}, [
      rules.requiredWhen("password", "=", ""),
    ]),
    confirmPassword: schema.string.optional({}, [
      rules.requiredIfExists("password"),
    ]),
    oldPassword: schema.string.optional({}, [
      rules.requiredIfExists("confirmPassword"),
    ]),
    name: schema.string.optional({ escape: true }, [
      rules.requiredWhen("name", "=", ""),
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
  public messages: CustomMessages = {};
}
