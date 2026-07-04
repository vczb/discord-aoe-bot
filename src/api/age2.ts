import type {
  FullStatsResponse,
  LeaderboardResponse,
  MatchListResponse,
  MatchDetailResponse,
} from "../types.js";
import { log } from "../utils.js";
import { get, set } from "../cache.js";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json, text/javascript, */*; q=0.01",
  Origin: "https://www.ageofempires.com",
  Referer: "https://www.ageofempires.com/",
};

async function apiFetch<T>(url: string, body: unknown): Promise<T> {
  log("[aoeii]", "POST", url);

  const res = await fetch(url, {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) {
    log("[aoeii]", "HTTP", res.status, url);
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
  }

  log("[aoeii]", "OK", url);

  return text ? (JSON.parse(text) as T) : ({} as T);
}

export async function getPlayer(
  username: string,
): Promise<LeaderboardResponse> {
  const key = `player:${username}`;

  const cached = get<LeaderboardResponse>(key);
  if (cached) {
    log("[aoeii]", "Cache hit", key);
    return cached;
  }

  log("[aoeii]", "Fetching player", username);

  const data = await apiFetch<LeaderboardResponse>(
    "https://api.ageofempires.com/api/v2/ageii/Leaderboard",
    {
      region: "7",
      matchType: "3",
      searchPlayer: username,
      page: 1,
      count: 1,
      sortColumn: "rank",
      sortDirection: "ASC",
    },
  );

  set(key, data);
  return data;
}

export async function getTopPlayers(): Promise<LeaderboardResponse> {
  const key = "topPlayers";

  const cached = get<LeaderboardResponse>(key);
  if (cached) {
    log("[aoeii]", "Cache hit", key);
    return cached;
  }

  log("[aoeii]", "Fetching top players");

  const data = await apiFetch<LeaderboardResponse>(
    "https://api.ageofempires.com/api/v2/ageii/Leaderboard",
    {
      region: "7",
      matchType: "3",
      searchPlayer: "",
      page: 1,
      count: 10,
      sortColumn: "rank",
      sortDirection: "ASC",
    },
  );

  set(key, data);
  return data;
}

export async function getMatches(
  profileId: number,
  count = 10,
): Promise<MatchListResponse> {
  const key = `matches:${profileId}:${count}`;

  const cached = get<MatchListResponse>(key);
  if (cached) {
    log("[aoeii]", "Cache hit", key);
    return cached;
  }

  log("[aoeii]", "Fetching matches", profileId);

  const data = await apiFetch<MatchListResponse>(
    "https://api.ageofempires.com/api/GameStats/AgeII/GetMatchList",
    {
      gamertag: "unknown",
      playerNumber: 0,
      game: "age2",
      profileId,
      sortColumn: "dateTime",
      sortDirection: "DESC",
      page: 1,
      recordCount: count,
      matchType: "3",
    },
  );

  set(key, data);
  return data;
}

export async function getMatchDetail(
  matchId: string,
): Promise<MatchDetailResponse> {
  const key = `match:${matchId}`;

  const cached = get<MatchDetailResponse>(key);
  if (cached) {
    log("[aoeii]", "Cache hit", key);
    return cached;
  }

  log("[aoeii]", "Fetching match", matchId);

  const data = await apiFetch<MatchDetailResponse>(
    "https://api.ageofempires.com/api/GameStats/AgeII/GetMatchDetail",
    { matchId },
  );

  set(key, data);
  return data;
}

export async function getFullStats(
  profileId: number,
): Promise<FullStatsResponse> {
  const key = `fullstats:${profileId}`;

  const cached = get<FullStatsResponse>(key);
  if (cached) {
    log("[aoeii]", "Cache hit", key);
    return cached;
  }

  log("[aoeii]", "Fetching full stats", profileId);

  const data = await apiFetch<FullStatsResponse>(
    "https://api.ageofempires.com/api/GameStats/AgeII/GetFullStats",
    {
      profileId: String(profileId),
      gamertag: "unknown",
      playerNumber: 0,
      gameId: 0,
      matchType: "3",
    },
  );

  set(key, data);
  return data;
}
