import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import League from "App/Models/League";
import LeagueValidator from "App/Validators/LeagueValidator";

export default class LeaguesController {
  public async create({ request }: HttpContextContract) {
    const league = request.only([
      "name",
      "short_name",
      "start_date",
      "end_date",
    ]);
    await request.validate(LeagueValidator);

    await League.create(league);
    return league;
  }

  public async index() {
    const leagues = await League.query().select("*");
    return { leagues };
  }

  public async update({ request }: HttpContextContract) {
    const { leagueId } = request.params();
    const updated = request.only([
      "name",
      "short_name",
      "start_date",
      "end_date",
    ]);
    await request.validate({
      schema: LeagueValidator.updateSchema,
    });

    const league = await League.findByOrFail("id", leagueId);

    await league.merge(updated);
    await league.save();

    return league;
  }

  public async delete({ request }: HttpContextContract) {
    const { leagueId } = request.params();

    const league = await League.findByOrFail("id", leagueId);

    await league.delete();

    return "You can create a new league to substitute the last one!";
  }
}
