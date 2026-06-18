import { LeaderboardResponse } from "./types.js";

export async function getPlayer(
  username: string,
): Promise<LeaderboardResponse> {
  const response = await fetch(
    "https://api.ageofempires.com/api/v2/ageii/Leaderboard",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        region: "7",
        matchType: "3",
        // consoleMatchType: 15,
        searchPlayer: username,
        page: 1,
        count: 100,
        sortColumn: "rank",
        sortDirection: "ASC",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
