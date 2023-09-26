import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "sport_bets";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("status").defaultTo("pending");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("status");
    });
  }
}
