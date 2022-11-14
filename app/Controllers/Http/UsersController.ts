import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import validate from "App/Services/validationUser";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import UpdateUserValidator from "App/Validators/UpdateUserValidator";

export default class UsersController {
  public async create({ request, auth, response }: HttpContextContract) {
    const data = request.only(["email", "password", "name"]);

    await request.validate(CreateUserValidator);

    const existentEmail = await User.findBy("email", data.email);

    if (existentEmail) {
      return response
        .status(400)
        .json({ error: { message: "Email already exists" } });
    }

    const user = await User.create(data);
    const token = await auth.use("api").attempt(data.email, data.password, {
      expiresIn: "7days",
    });
    return { user, token };
  }

  public async index({ auth }: HttpContextContract) {
    const { id } = await auth.use("api").authenticate();

    const user = await User.findByOrFail("id", id);

    await user.load("bets", (queryUser) => {
      queryUser.preload("type", (queryGame) => {
        queryGame.select("id", "type", "color");
      });
    });

    return user;
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { id } = await auth.use("api").authenticate();

    await request.validate(UpdateUserValidator);

    const user = await User.findByOrFail("id", id);

    const data = request.only(["email", "password", "name"]);
    const confirmation = request.only(["ConfirmPassword", "oldPassword"]);

    const test = await validate(user, data, confirmation);

    if (!test?.sucess) {
      return response.status(500).json({ error: { message: test?.message } });
    }

    await user.merge(data);

    await user.save();

    return user;
  }

  public async delete({ auth }: HttpContextContract) {
    const { id } = await auth.use("api").authenticate();

    const user = await User.findByOrFail("id", id);

    await user.delete();

    return "User deleted succssfully";
  }
}
