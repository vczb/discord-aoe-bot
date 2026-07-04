import { Guild } from "discord.js";
import { GuildModel } from "../models/guilds.js";
import { log, logError } from "../utils.js";

export const guildController = {
  async onGuildCreate(guild: Guild) {
    try {
      if (!guild?.id) {
        throw new Error("onGuildCreate: guild.id is missing");
      }

      log("onGuildCreate", guild.id);

      const existing = await GuildModel.findByDiscordId(guild.id);

      if (existing) {
        return GuildModel.updateByDiscordId(guild.id, {
          name: guild.name,
          icon: guild.icon,
          member_count: guild.memberCount,
          is_active: true,
        });
      }

      return GuildModel.create({
        discord_guild_id: guild.id,
        name: guild.name,
        icon: guild.icon,
        member_count: guild.memberCount,
        owner_discord_user_id: guild.ownerId,
        is_active: true,
      });
    } catch (error) {
      logError(error);
    }
  },
  async onGuildDelete(guild: Guild) {
    try {
      if (!guild?.id) {
        throw new Error("onGuildDelete: guild.id is missing");
      }

      log("onGuildDelete", guild.id);

      const existing = await GuildModel.findByDiscordId(guild.id);

      if (existing) {
        return GuildModel.updateByDiscordId(guild.id, {
          is_active: false,
        });
      }
    } catch (error) {
      logError(error);
    }
  },
};
