import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AdminVerify {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const { is_admin } = await auth.use("api").authenticate();
    if (!is_admin) {
      return response
        .status(501)
        .json(
          "You're not authorized to access this page, please contact our team for more information at: 9999-9999"
        );
    }
    await next();
  }
}
