/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("guilds", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table.string("discord_guild_id").notNullable().unique();
    table.string("name").notNullable();
    table.string("icon").nullable();
    table.integer("member_count").notNullable().defaultTo(0);
    table.string("owner_discord_user_id").notNullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

/**
 * @param {import('knex').Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("guilds");
}
