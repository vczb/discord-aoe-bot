import { InteractionType, InteractionResponseType } from "discord-interactions";
import type { Request, Response } from "express";
import { sendMessage } from "../api/discord.js";
import {
  getPlayer,
  getTopPlayers,
  getMatches,
  getMatchDetail,
} from "../api/age2.js";

import {
  formatPlayerResponse,
  formatTop10Response,
  formatLastMatchResponse,
} from "../views/interaction.js";
import { log, logError, sleep } from "../utils.js";

/* ------------------------------ Player ------------------------------ */

async function handlePlayer(username: string, ctx: any) {
  try {
    log(`handlePlayer: ${username}`);

    const result = await getPlayer(username);

    if (!result.items?.length) {
      return sendMessage(ctx, { content: "No player found" });
    }

    return sendMessage(ctx, formatPlayerResponse(result));
  } catch (err) {
    logError(err);
  }
}

/* ------------------------------ Top10 ------------------------------ */

async function handleTop10(ctx: any) {
  try {
    log("handleTop10");
    const result = await getTopPlayers();

    if (!result.items?.length) {
      return sendMessage(ctx, { content: "No players found" });
    }

    return sendMessage(ctx, formatTop10Response(result));
  } catch (err) {
    logError(err);
  }
}

/* ------------------------------ Last Match ------------------------------ */

async function handleLastMatch(playerName: string, ctx: any) {
  try {
    log(`handleLastMatch: ${playerName}`);
    const playerResult = await getPlayer(playerName);

    if (!playerResult.items?.length) {
      return sendMessage(ctx, {
        content: "No player found",
      });
    }

    await sleep(800);

    const player = playerResult.items[0];

    const profileId = player.rlUserId;
    log("ProfileID:", profileId);

    const matches = await getMatches(profileId, 1);
    log("Matches found:", matches.matchList?.length);

    await sleep(800);

    if (!matches.matchList?.length) {
      return sendMessage(ctx, {
        content: `No matches found for ${player.userName}`,
      });
    }

    const match = matches.matchList[0];
    const detail = await getMatchDetail(match.matchId);

    log("Details found");

    const payload = formatLastMatchResponse(
      player.userName,
      detail,
      player.avatarUrl,
    );

    return sendMessage(ctx, payload);
  } catch (err) {
    logError(err);
  }
}

/* ------------------------------ Commands ------------------------------ */

const commands: Record<string, (data: any, ctx: any) => Promise<void>> = {
  player: async (data, ctx) => {
    const username = data.options?.[0]?.value;

    if (!username) {
      return sendMessage(ctx, { content: "Please provide a username" });
    }

    return handlePlayer(username, ctx);
  },

  top10: async (_data, ctx) => {
    return handleTop10(ctx);
  },

  lastmatch: async (data, ctx) => {
    const username = data.options?.[0]?.value;

    if (!username) {
      return sendMessage(ctx, {
        content: "Please provide a username",
      });
    }

    return handleLastMatch(username, ctx);
  },
};

/* ------------------------------ Interaction ------------------------------ */

export async function handleInteraction(req: Request, res: Response) {
  const { type, data, token, application_id } = req.body;

  const ctx = {
    appId: application_id,
    token,
  };

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type !== InteractionType.APPLICATION_COMMAND) {
    return res.status(400).send();
  }

  res.send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });

  try {
    const handler = data?.name ? commands[data.name] : null;

    if (!handler) {
      return sendMessage(ctx, {
        content: "Unknown command",
      });
    }

    await handler(data, ctx);
  } catch (err) {
    logError(err);
  }
}
