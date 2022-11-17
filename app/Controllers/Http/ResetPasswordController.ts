import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import PasswordValidator from "App/Validators/PasswordValidator";
import ResetPasswordValidator from "App/Validators/ResetPasswordValidator";
import moment from "moment";
import { uuid } from "uuidv4";

export default class ResetPasswordController {
  public async store({ request, response }: HttpContextContract) {
    const { email } = request.all();
    await request.validate(ResetPasswordValidator);

    try {
      const user = await User.findByOrFail("email", email);

      user.token = uuid().toString();

      user.token_created_at = new Date();

      await user.save();

      return user;
    } catch (error) {
      response.notFound({
        message: "User not found in our database",
      });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { token } = request.params();

    const user = await User.findByOrFail("token", token);

    const tokenExpired = moment()
      .subtract("2", "days")
      .isAfter(user.token_created_at);
    if (tokenExpired) {
      return response
        .status(401)
        .send({ error: { message: "Opss, your token has been expired" } });
    }

    const { password } = request.all();

    await request.validate(PasswordValidator);

    user.password = password;
    user.token_created_at = undefined;
    user.token = undefined;

    await user.save();

    return user;
  }
}
