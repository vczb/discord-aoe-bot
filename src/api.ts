import { LeaderboardResponse, MatchListResponse } from "./types.js";
import { get, set } from "./cache.js";

export async function getPlayer(
  username: string,
): Promise<LeaderboardResponse> {
  const cached = get<LeaderboardResponse>(`player:${username}`);
  if (cached) return cached;

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

  const data = await response.json();
  set(`player:${username}`, data);
  return data;
}

export async function getMatches(
  profileId: number,
  count = 10,
): Promise<MatchListResponse> {
  const key = `matches:${profileId}:${count}`;
  const cached = get<MatchListResponse>(key);
  if (cached) return cached;

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

  const data = (await response.json()) as MatchListResponse;
  set(key, data);
  return data;
}
