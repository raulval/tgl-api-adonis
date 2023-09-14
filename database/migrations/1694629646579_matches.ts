import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "matches";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("id");
      table.string("name");
      table.bigInteger("start_time");
      table.json("participants");
      table.json("odds");
      table.integer("league_id");

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}