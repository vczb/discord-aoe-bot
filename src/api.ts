import { LeaderboardResponse, MatchListResponse } from "./types.js";

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

export async function getMatches(
  profileId: number,
  count = 10,
): Promise<MatchListResponse> {
  const response = await fetch(
    "https://api.ageofempires.com/api/GameStats/AgeII/GetMatchList",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gamertag: "unknown user",
        playerNumber: 0,
        game: "age2",
        profileId,
        sortColumn: "dateTime",
        sortDirection: "DESC",
        page: 1,
        recordCount: count,
        matchType: "3",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch matches: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<MatchListResponse>;
}
