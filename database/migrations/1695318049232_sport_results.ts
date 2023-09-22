import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "sport_results";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger("id").primary();
      table.string("winner");
      table.json("score");
      table.json("participants");
      table.bigInteger("started_date");
      table.string("match_id").references("id").inTable("matches");

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
