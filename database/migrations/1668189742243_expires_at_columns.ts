import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "api_tokens";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("updated_at");
      table.timestamp("expires_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp("updated_at", { useTz: true });
      table.dropColumn("expires_at");
    });
  }
}
