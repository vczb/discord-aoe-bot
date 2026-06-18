import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from "discord-interactions";
import { getPlayer } from "./api.js";

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
