import type {
  LeaderboardResponse,
  MatchDetailResponse,
  FullStatsResponse,
} from "../types.js";

export function formatPlayerResponse(result: LeaderboardResponse): object {
  const player = result.items[0];

  return {
    embeds: [
      {
        title: player.userName,
        color: 0x5865f2,
        ...(player.avatarUrl ? { thumbnail: { url: player.avatarUrl } } : {}),
        fields: [
          { name: "Rank", value: `#${player.rank}`, inline: true },
          { name: "ELO", value: String(player.elo), inline: true },
          {
            name: "Win Rate",
            value: `${player.winPercent}%`,
            inline: true,
          },
          { name: "Wins", value: String(player.wins), inline: true },
          { name: "Losses", value: String(player.losses), inline: true },
        ],
      },
    ],
  };
}

export function formatTop10Response(result: LeaderboardResponse): object {
  return {
    embeds: [
      {
        title: "🏆 Top 10 Players",
        color: 0xf1c40f,
        description: result.items
          .slice(0, 10)
          .map(
            (player) =>
              `**#${player.rank}** ${player.userName} • ${player.elo} ELO (${player.wins}-${player.losses})`,
          )
          .join("\n"),
      },
    ],
  };
}

export function formatStatsResponse(
  playerName: string,
  stats: FullStatsResponse,
): object {
  const cs = stats.careerStats;
  const mp = stats.mpStatList;

  return {
    embeds: [
      {
        title: `${playerName} — Career Stats`,
        color: 0x3498db,
        fields: [
          {
            name: "Multiplayer",
            value:
              `${mp.totalMatches} matches\n` +
              `${mp.totalWins} wins\n` +
              `Current streak: ${mp.currentWinStreak}`,
          },
          {
            name: "Units",
            value:
              `${cs.unitsKilled.toLocaleString()} killed\n` +
              `${cs.unitsLost.toLocaleString()} lost`,
            inline: true,
          },
          {
            name: "Buildings",
            value:
              `${cs.buildingsRaised.toLocaleString()} raised\n` +
              `${cs.buildingsLost.toLocaleString()} lost`,
            inline: true,
          },
          {
            name: "Economy",
            value:
              `Castles: ${cs.castlesBuilt}\n` +
              `Wonders: ${cs.wondersBuilt}\n` +
              `Farms: ${cs.farmsBuilt.toLocaleString()}\n` +
              `Trebs: ${cs.trebsBuilt}`,
          },
          {
            name: "High Scores",
            value:
              `Total: ${cs.highScoreTotal.toLocaleString()}\n` +
              `Military: ${cs.highScoreMilitary.toLocaleString()}\n` +
              `Economy: ${cs.highScoreEconomy.toLocaleString()}\n` +
              `Tech: ${cs.highScoreTechnology.toLocaleString()}`,
          },
        ],
      },
    ],
  };
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
