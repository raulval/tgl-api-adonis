import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";

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

  public async delete({ auth }: HttpContextContract) {
    const { id } = await auth.use("api").authenticate();

    const user = await User.findByOrFail("id", id);

    await user.delete();

    return "User deleted succssfully";
  }
}
