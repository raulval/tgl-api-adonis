import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.all();

    try {
      const user = await User.findByOrFail("email", email);
      const token = await auth.use("api").attempt(email, password, {
        name: user?.name,
        expiresIn: "7days",
      });

      return { user, token };
    } catch (error) {
      response.unauthorized({ message: "Incorrect password or email" });
    }
  }
}
