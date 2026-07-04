import { Guild } from "discord.js";
import { log } from "../utils.js";

const DISCORD_API = "https://discord.com/api/v10";

export async function getGuild(guildId: string): Promise<Guild> {
  log("[discord]", "Fetching guild", guildId);

  const response = await fetch(`${DISCORD_API}/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
  });

  if (!response.ok) {
    log("[discord]", "HTTP", response.status, "GET /guilds");
    throw new Error(`HTTP ${response.status}`);
  }

  log("[discord]", "OK", "GET /guilds");

  return response.json();
}

type Ctx = {
  appId: string;
  token: string;
};

export async function sendMessage(ctx: Ctx, payload: unknown): Promise<any> {
  log("[discord]", "PATCH @original");

  const response = await fetch(
    `${DISCORD_API}/webhooks/${ctx.appId}/${ctx.token}/messages/@original`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    log("[discord]", "HTTP", response.status, "PATCH @original");
  } else {
    log("[discord]", "OK", "PATCH @original");
  }

  return response;
}
































