import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tariffs", (table) => {
    table.increments("id").primary();

    table.date("date").notNullable();

    table.string("geo_name").notNullable();
    table.string("warehouse_name").notNullable();

    table.decimal("box_delivery_coef_expr", 10, 2);
    table.decimal("box_delivery_marketplace_coef_expr", 10, 2);

    table.decimal("box_storage_base", 10, 4);
    table.decimal("box_storage_coef_expr", 10, 2);

    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.unique(["date", "geo_name", "warehouse_name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tariffs");
}