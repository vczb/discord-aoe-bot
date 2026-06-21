import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from "discord-interactions";
import { getPlayer, getMatches, getTopPlayers } from "./api.js";

interface InteractionData {
  name?: string;
  options?: { name: string; value: string }[];
}

interface InteractionBody {
  type: InteractionType;
  data: InteractionData;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  async function (req: express.Request, res: express.Response) {
    const { type, data } = req.body as InteractionBody;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      if (data.name === "player") {
        const username = data.options?.[0]?.value;

        if (!username) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Please provide a username." },
          });
        }

        try {
          const result = await getPlayer(username);

          if (!result.items?.length) {
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { content: `No player found for **${username}**` },
            });
          }

          const player = result.items[0];
          const content =
            `**${player.userName}** — Rank #${player.rank} (${player.elo} ELO)\n` +
            `Wins: ${player.wins} | Losses: ${player.losses} | Win Rate: ${player.winPercent}%`;

          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content },
          });
        } catch (err) {
          console.error(err);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Error looking up player. Try again later." },
          });
        }
      }

      if (data.name === "top10") {
        try {
          const result = await getTopPlayers();

          if (!result.items?.length) {
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { content: "No players found" },
            });
          }

          const content =
            "**Top 10 Players**\n\n" +
            result.items
              .map(
                (player) =>
                  `#${player.rank} **${player.userName}** — ${player.elo} ELO (${player.wins}-${player.losses})`,
              )
              .join("\n");

          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content },
          });
        } catch (err) {
          console.error(err);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Error fetching top players. Try again later." },
          });
        }
      }

      if (data.name === "lastmatch") {
        const playerName = data.options?.[0]?.value;

        if (!playerName) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Please provide a player name." },
          });
        }

        try {
          const playerResult = await getPlayer(playerName);

          if (!playerResult.items?.length) {
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: { content: `No player found for **${playerName}**` },
            });
          }

          const player = playerResult.items[0];
          const matches = await getMatches(player.rlUserId, 1);

          if (!matches.matchList?.length) {
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `No matches found for **${player.userName}**`,
              },
            });
          }

          const match = matches.matchList[0];
          const isWin = match.winLoss === "Win";
          const lengthMinutes = Math.floor(match.matchLength / 60);
          const lengthSeconds = match.matchLength % 60;
          const matchDate = new Date(match.dateTime).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          );

          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [
                {
                  title: `Latest Match — ${player.userName}`,
                  color: isWin ? 0x57f287 : 0xed4245,
                  thumbnail: { url: player.avatarUrl },
                  fields: [
                    {
                      name: "Result",
                      value: match.winLoss,
                      inline: true,
                    },
                    {
                      name: "Civilization",
                      value: match.civilization,
                      inline: true,
                    },
                    { name: "Map", value: match.mapType, inline: true },
                    {
                      name: "Match Length",
                      value: `${lengthMinutes}:${lengthSeconds.toString().padStart(2, "0")}`,
                      inline: true,
                    },
                    {
                      name: "Players",
                      value: String(match.playerCount),
                      inline: true,
                    },
                    { name: "Date", value: matchDate, inline: true },
                  ],
                  footer: {
                    text: `Match ID: ${match.matchId}`,
                  },
                },
              ],
            },
          });
        } catch (err) {
          console.error(err);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "Error fetching last match. Try again later.",
            },
          });
        }
      }

      console.error(`unknown command: ${data.name}`);
      return res.status(400).json({ error: "unknown command" });
    }

    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  },
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
