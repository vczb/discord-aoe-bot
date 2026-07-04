import db from "../database/db.js";

export interface CreateGuildInput {
  discord_guild_id: string;
  name: string;
  icon: string | null;
  member_count: number;
  owner_discord_user_id: string;
  is_active: boolean;
}

export const GuildModel = {
  async create(guild: CreateGuildInput) {
    const [row] = await db("guilds")
      .insert({
        ...guild,
        is_active: true,
      })
      .returning("*");

    return row;
  },

  async findByDiscordId(discordGuildId: string) {
    return db("guilds").where({ discord_guild_id: discordGuildId }).first();
  },

  async updateByDiscordId(
    discordGuildId: string,
    data: Partial<CreateGuildInput>,
  ) {
    const [row] = await db("guilds")
      .where({ discord_guild_id: discordGuildId })
      .update(data)
      .returning("*");

    return row;
  },
};
