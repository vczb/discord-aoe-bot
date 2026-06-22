import {
  FullStatsResponse,
  LeaderboardResponse,
  MatchListResponse,
  MatchDetailResponse,
} from "../types.js";
import { get, set } from "../cache.js";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json, text/javascript, */*; q=0.01",
  Origin: "https://www.ageofempires.com",
  Referer: "https://www.ageofempires.com/",
};

const TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;

let queue: Promise<unknown> = Promise.resolve();

async function jsonFetch<T>(url: string, body: unknown): Promise<T> {
  await queue;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(1000 * 2 ** attempt, 10_000) + Math.random() * 500;
      await new Promise((r) => setTimeout(r, delay));
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: BASE_HEADERS,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (response.ok) {
        const text = await response.text();
        if (!text) {
          throw new Error(`Empty response from ${url}`);
        }
        return JSON.parse(text) as T;
      }

      if (response.status === 429 && attempt < MAX_RETRIES) {
        const retryAfter = response.headers.get("Retry-After");
        const wait = retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined;
        console.warn(`429 on ${url}, retrying in ${wait ?? "..."}ms (attempt ${attempt + 1})`);
        if (wait) await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      throw new Error(`HTTP ${response.status} ${response.statusText} — ${url}`);
    } catch (err) {
      if (attempt < MAX_RETRIES && err instanceof Error && err.name !== "AbortError") {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error(`Request failed after ${MAX_RETRIES} retries`);
}

function serialFetch<T>(url: string, body: unknown): Promise<T> {
  const promise = queue.then(() => jsonFetch<T>(url, body));
  queue = promise.catch(() => {});
  return promise;
}

export async function getPlayer(
  username: string,
): Promise<LeaderboardResponse> {
  const cached = get<LeaderboardResponse>(`player:${username}`);
  if (cached) return cached;

  const data = await serialFetch<LeaderboardResponse>(
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

  set(`player:${username}`, data);
  return data;
}

export async function getTopPlayers(): Promise<LeaderboardResponse> {
  const cached = get<LeaderboardResponse>(`topPlayers`);
  if (cached) return cached;

  const data = await serialFetch<LeaderboardResponse>(
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
  set(`topPlayers`, data);
  return data;
}

export async function getMatches(
  profileId: number,
  count = 10,
): Promise<MatchListResponse> {
  const key = `matches:${profileId}:${count}`;
  const cached = get<MatchListResponse>(key);
  if (cached) return cached;

  const data = await serialFetch<MatchListResponse>(
    "https://api.ageofempires.com/api/GameStats/AgeII/GetMatchList",
    {
      gamertag: "unknown user",
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
  if (cached) return cached;

  const data = await serialFetch<MatchDetailResponse>(
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
  if (cached) return cached;

  const data = await serialFetch<FullStatsResponse>(
    "https://api.ageofempires.com/api/GameStats/AgeII/GetFullStats",
    {
      profileId: String(profileId),
      gamertag: "unknown user",
      playerNumber: 0,
      gameId: 0,
      matchType: "3",
    },
  );

  set(key, data);
  return data;
}
