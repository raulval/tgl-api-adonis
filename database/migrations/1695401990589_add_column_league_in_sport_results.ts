import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "sport_results";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("league");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("league");
    });
  }
}
