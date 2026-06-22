import type {
  LeaderboardResponse,
  MatchDetailResponse,
  FullStatsResponse,
} from "../types.js";

export function formatPlayerResponse(
  result: LeaderboardResponse,
): string {
  const player = result.items[0];
  return (
    `**${player.userName}** — Rank #${player.rank} (${player.elo} ELO)\n` +
    `Wins: ${player.wins} | Losses: ${player.losses} | Win Rate: ${player.winPercent}%`
  );
}

export function formatTop10Response(
  result: LeaderboardResponse,
): string {
  const header = "**Top 10 Players**\n\n";
  let lines = result.items
    .slice(0, 10)
    .map(
      (player) =>
        `#${player.rank} **${player.userName}** — ${player.elo} ELO (${player.wins}-${player.losses})`,
    );
  while (header.length + lines.join("\n").length + 3 > 2000) {
    lines.pop();
    if (lines.length > 0) {
      lines[lines.length - 1] += "...";
    }
  }
  return header + lines.join("\n");
}

export function formatStatsResponse(
  playerName: string,
  stats: FullStatsResponse,
): string {
  const cs = stats.careerStats;
  const mp = stats.mpStatList;
  return (
    `**${playerName}** — Career Stats\n\n` +
    `**Multiplayer** — ${mp.totalMatches} matches, ${mp.totalWins} wins (current streak: ${mp.currentWinStreak})\n\n` +
    `**Units** — ${cs.unitsKilled.toLocaleString()} killed / ${cs.unitsLost.toLocaleString()} lost\n` +
    `**Buildings** — ${cs.buildingsRaised.toLocaleString()} raised / ${cs.buildingsLost.toLocaleString()} lost\n` +
    `**Castles Built:** ${cs.castlesBuilt} | **Wonders Built:** ${cs.wondersBuilt}\n` +
    `**Farms Built:** ${cs.farmsBuilt.toLocaleString()} | **Trebs Built:** ${cs.trebsBuilt}\n` +
    `**High Scores** — Total: ${cs.highScoreTotal.toLocaleString()} | Military: ${cs.highScoreMilitary.toLocaleString()} | Economy: ${cs.highScoreEconomy.toLocaleString()} | Tech: ${cs.highScoreTechnology.toLocaleString()}`
  );
}

export function formatLastMatchResponse(
  playerName: string,
  detail: MatchDetailResponse,
  avatarUrl?: string,
): object {
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

  return {
    embeds: [
      {
        title: `Latest Match — ${playerName}`,
        color: isWin ? 0x57f287 : 0xed4245,
        ...(avatarUrl ? { thumbnail: { url: avatarUrl } } : {}),
        fields: [
          { name: "Result", value: ms.winLoss ?? "", inline: true },
          {
            name: "Match Length",
            value: `${lengthMinutes}:${lengthSeconds.toString().padStart(2, "0")}`,
            inline: true,
          },
          { name: "Civilization", value: ms.civilization ?? "", inline: true },
          { name: "Map", value: ms.mapType, inline: true },
          { name: "Players", value: String(ms.playerCount), inline: true },
          { name: "Date", value: matchDate, inline: true },
          { name: "Players Detail", value: playersField, inline: false },
        ],
        footer: { text: `Match ID: ${ms.matchId}` },
      },
    ],
  };
}
