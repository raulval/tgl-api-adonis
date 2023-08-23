import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    await User.firstOrCreate({
      id: 1,
      email: "admin@tgl.com",
      password: "secret",
      is_admin: true,
      name: "TGL",
      credits: 100,
    });
  }
}
