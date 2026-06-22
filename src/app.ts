import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from "discord-interactions";
import {
  getPlayer,
  getMatches,
  getMatchDetail,
  getTopPlayers,
  getFullStats,
} from "./api.js";

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

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY!),
  async function (req: express.Request, res: express.Response) {
    const { type, data, token, application_id } = req.body as InteractionBody;
    console.log("Data received:", req.body);
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

    async function respond(payload: unknown) {
      try {
        const r = await reply(application_id, token, payload);
        if (!r.ok) {
          const body = await r.text();
          console.error(`Follow-up failed (${r.status}): ${body}`);
        }
      } catch (err) {
        console.error("Failed to send follow-up:", err);
      }
    }

    const COMMAND_TIMEOUT_MS = 30_000;
    const timer = setTimeout(() => {
      respond({ content: "The AoE API is taking too long. Please try again later." });
    }, COMMAND_TIMEOUT_MS);

    async function run() {
      try {
        await handleCommand();
      } finally {
        clearTimeout(timer);
      }
    }

    async function handleCommand() {
    if (data.name === "player") {
      const username = data.options?.[0]?.value;

      if (!username) {
        await respond({ content: "Please provide a username." });
        return;
      }

      try {
        const result = await getPlayer(username);

        if (!result.items?.length) {
          await respond({ content: `No player found for **${username}**` });
          return;
        }

        const player = result.items[0];
        await respond({
          content:
            `**${player.userName}** — Rank #${player.rank} (${player.elo} ELO)\n` +
            `Wins: ${player.wins} | Losses: ${player.losses} | Win Rate: ${player.winPercent}%`,
        });
      } catch (err) {
        console.error(err);
        await respond({ content: "Error looking up player. Try again later." });
      }
      return;
    }

    if (data.name === "top10") {
      try {
        const result = await getTopPlayers();
        console.log("Top players result:", result);
        if (!result.items?.length) {
          await respond({ content: "No players found" });
          return;
        }

        const header = "**Top 10 Players**\n\n";
        let lines = result.items.slice(0, 10).map(
          (player) =>
            `#${player.rank} **${player.userName}** — ${player.elo} ELO (${player.wins}-${player.losses})`,
        );
        while (header.length + lines.join("\n").length + 3 > 2000) {
          lines.pop();
          lines[lines.length - 1] += "...";
        }
        await respond({ content: header + lines.join("\n") });
      } catch (err) {
        console.error(err);
        await respond({
          content: "Error fetching top players. Try again later.",
        });
      }
      return;
    }

    if (data.name === "stats") {
      const username = data.options?.[0]?.value;

      if (!username) {
        await respond({ content: "Please provide a username." });
        return;
      }

      try {
        const playerResult = await getPlayer(username);

        if (!playerResult.items?.length) {
          await respond({ content: `No player found for **${username}**` });
          return;
        }

        const player = playerResult.items[0];
        const stats = await getFullStats(player.rlUserId);
        const cs = stats.careerStats;
        const mp = stats.mpStatList;

        await respond({
          content:
            `**${player.userName}** — Career Stats\n\n` +
            `**Multiplayer** — ${mp.totalMatches} matches, ${mp.totalWins} wins (current streak: ${mp.currentWinStreak})\n\n` +
            `**Units** — ${cs.unitsKilled.toLocaleString()} killed / ${cs.unitsLost.toLocaleString()} lost\n` +
            `**Buildings** — ${cs.buildingsRaised.toLocaleString()} raised / ${cs.buildingsLost.toLocaleString()} lost\n` +
            `**Castles Built:** ${cs.castlesBuilt} | **Wonders Built:** ${cs.wondersBuilt}\n` +
            `**Farms Built:** ${cs.farmsBuilt.toLocaleString()} | **Trebs Built:** ${cs.trebsBuilt}\n` +
            `**High Scores** — Total: ${cs.highScoreTotal.toLocaleString()} | Military: ${cs.highScoreMilitary.toLocaleString()} | Economy: ${cs.highScoreEconomy.toLocaleString()} | Tech: ${cs.highScoreTechnology.toLocaleString()}`,
        });
      } catch (err) {
        console.error(err);
        await respond({ content: "Error fetching stats. Try again later." });
      }
      return;
    }

    if (data.name === "lastmatch") {
      const playerName = data.options?.[0]?.value;

      if (!playerName) {
        await respond({ content: "Please provide a player name." });
        return;
      }

      try {
        const playerResult = await getPlayer(playerName);

        if (!playerResult.items?.length) {
          await respond({ content: `No player found for **${playerName}**` });
          return;
        }

        const player = playerResult.items[0];
        const matches = await getMatches(player.rlUserId, 1);

        if (!matches.matchList?.length) {
          await respond({
            content: `No matches found for **${player.userName}**`,
          });
          return;
        }

        const match = matches.matchList[0];
        const detail = await getMatchDetail(match.matchId);
        const ms = detail.matchSummary;
        const isWin = ms.winLoss === "Win";
        const lengthMinutes = Math.floor(ms.matchLength / 60);
        const lengthSeconds = ms.matchLength % 60;
        const matchDate = new Date(ms.dateTime).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const teams = new Map<number, string[]>();
        for (const p of detail.playerList) {
          const entry = teams.get(p.team) || [];
          entry.push(`${p.userName} (${p.civName}, ${p.elo ?? "?"} ELO)`);
          teams.set(p.team, entry);
        }
        const playersField = [...teams.entries()]
          .sort(([a], [b]) => a - b)
          .map(([team, members]) => `**Team ${team}**\n${members.join("\n")}`)
          .join("\n\n");

        await respond({
          embeds: [
            {
              title: `Latest Match — ${player.userName}`,
              color: isWin ? 0x57f287 : 0xed4245,
              thumbnail: { url: player.avatarUrl },
              fields: [
                {
                  name: "Result",
                  value: ms.winLoss ?? match.winLoss,
                  inline: true,
                },
                {
                  name: "Match Length",
                  value: `${lengthMinutes}:${lengthSeconds.toString().padStart(2, "0")}`,
                  inline: true,
                },
                {
                  name: "Civilization",
                  value: ms.civilization ?? match.civilization,
                  inline: true,
                },
                { name: "Map", value: ms.mapType, inline: true },
                {
                  name: "Players",
                  value: String(ms.playerCount),
                  inline: true,
                },
                { name: "Date", value: matchDate, inline: true },
                { name: "Players Detail", value: playersField, inline: false },
              ],
              footer: { text: `Match ID: ${match.matchId}` },
            },
          ],
        });
      } catch (err) {
        console.error(err);
        await respond({
          content: "Error fetching last match. Try again later.",
        });
      }
      return;
    }

    console.error(`unknown command: ${data.name}`);
    await respond({ content: `Unknown command: ${data.name}` });
  }

    run();
  },
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
