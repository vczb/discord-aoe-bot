export interface LeaderboardResponse {
  id: string;
  count: number;
  gameId: string | null;
  leaderboardId: number;
  region: number;
  lastUpdated: string;
  items: {
    gameId: string;
    userId: number | null;
    rlUserId: number;
    userName: string;
    avatarUrl: string;
    playerNumber: number | null;
    elo: number;
    eloRating: number;
    eloHighest: number;
    rank: number;
    rankTotal: number;
    region: string;
    wins: number;
    winPercent: number;
    losses: number;
    winStreak: number;
    totalGames: number;
    rankLevel: string;
    rankIcon: string;
    leaderboardKey: string;
  }[];
  isEvent: boolean;
  compressedItems: null;
}
