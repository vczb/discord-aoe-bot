import { InteractionType, InteractionResponseType } from "discord-interactions";
import type { Request, Response } from "express";
import {
  getPlayer,
  getMatches,
  getMatchDetail,
  getTopPlayers,
  getFullStats,
} from "../api/age2.js";
import {
  formatPlayerResponse,
  formatTop10Response,
  formatStatsResponse,
  formatLastMatchResponse,
} from "../views/interaction.js";
interface InteractionData {
  name?: string;
  options?: { name: string; value: string }[];
}

interface InteractionBody {
  type: InteractionType;
  data: InteractionData;
  token: string;
  application_id: string;
}

const DISCORD_API = "https://discord.com/api/v10";

function reply(appId: string, token: string, payload: unknown) {
  return fetch(`${DISCORD_API}/webhooks/${appId}/${token}/messages/@original`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function respond(payload: unknown, appId: string, token: string) {
  try {
    const r = await reply(appId, token, payload);
    if (!r.ok) {
      const body = await r.text();
      console.error(`Follow-up failed (${r.status}): ${body}`);
    }
  } catch (err) {
    console.error("Failed to send follow-up:", err);
  }
}

async function handlePlayer(username: string, appId: string, token: string) {
  const result = await getPlayer(username);

  if (!result.items?.length) {
    await respond(
      { content: `No player found for **${username}**` },
      appId,
      token,
    );
    return;
  }

  await respond({ content: formatPlayerResponse(result) }, appId, token);
}

async function handleTop10(appId: string, token: string) {
  const result = await getTopPlayers();

  if (!result.items?.length) {
    await respond({ content: "No players found" }, appId, token);
    return;
  }

  await respond({ content: formatTop10Response(result) }, appId, token);
}

async function handleStats(username: string, appId: string, token: string) {
  const playerResult = await getPlayer(username);

  if (!playerResult.items?.length) {
    await respond(
      { content: `No player found for **${username}**` },
      appId,
      token,
    );
    return;
  }

  const player = playerResult.items[0];
  const stats = await getFullStats(player.rlUserId);

  await respond(
    { content: formatStatsResponse(player.userName, stats) },
    appId,
    token,
  );
}

async function handleLastMatch(
  playerName: string,
  appId: string,
  token: string,
) {
  const playerResult = await getPlayer(playerName);

  if (!playerResult.items?.length) {
    await respond(
      { content: `No player found for **${playerName}**` },
      appId,
      token,
    );
    return;
  }

  const player = playerResult.items[0];
  const matches = await getMatches(player.rlUserId, 1);

  if (!matches.matchList?.length) {
    await respond(
      { content: `No matches found for **${player.userName}**` },
      appId,
      token,
    );
    return;
  }

  const match = matches.matchList[0];
  const detail = await getMatchDetail(match.matchId);

  await respond(
    formatLastMatchResponse(player.userName, detail, player.avatarUrl),
    appId,
    token,
  );
}

export async function handleInteraction(req: Request, res: Response) {
  const { type, data, token, application_id } = req.body as InteractionBody;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type !== InteractionType.APPLICATION_COMMAND) {
    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  }

  res.send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });

  const COMMAND_TIMEOUT_MS = 30_000;
  const timer = setTimeout(() => {
    respond(
      { content: "The AoE API is taking too long. Please try again later." },
      application_id,
      token,
    );
  }, COMMAND_TIMEOUT_MS);

  async function run() {
    try {
      switch (data.name) {
        case "player": {
          const username = data.options?.[0]?.value;
          if (!username) {
            await respond(
              { content: "Please provide a username." },
              application_id,
              token,
            );
            return;
          }
          await handlePlayer(username, application_id, token);
          return;
        }

        case "top10":
          await handleTop10(application_id, token);
          return;

        case "stats": {
          const username = data.options?.[0]?.value;
          if (!username) {
            await respond(
              { content: "Please provide a username." },
              application_id,
              token,
            );
            return;
          }
          await handleStats(username, application_id, token);
          return;
        }

        case "lastmatch": {
          const playerName = data.options?.[0]?.value;
          if (!playerName) {
            await respond(
              { content: "Please provide a player name." },
              application_id,
              token,
            );
            return;
          }
          await handleLastMatch(playerName, application_id, token);
          return;
        }

        default:
          console.error(`unknown command: ${data.name}`);
          await respond(
            { content: `Unknown command: ${data.name}` },
            application_id,
            token,
          );
      }
    } catch (err) {
      console.error(err);
      await respond(
        { content: "An error occurred. Please try again later." },
        application_id,
        token,
      );
    } finally {
      clearTimeout(timer);
    }
  }

  run();
}
