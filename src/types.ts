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

export interface MatchListResponse {
  matchList: {
    gameId: string | null;
    matchId: string;
    profileId: number;
    userName: string | null;
    avatarUrl: string | null;
    dateTime: string;
    matchLength: number;
    playerCount: number;
    victoryResultID: number;
    mapType: string;
    civilizationID: number;
    civilization: string;
    winLoss: "Win" | "Loss";
  }[];
  totalMatches: number;
}

export interface MatchDetailResponse {
  matchSummary: {
    gameId: string | null;
    matchId: string;
    profileId: number;
    userName: string | null;
    avatarUrl: string | null;
    dateTime: string;
    matchLength: number;
    playerCount: number;
    victoryResultID: number;
    mapType: string;
    civilizationID: number;
    civilization: string | null;
    winLoss: "Win" | "Loss" | null;
  };
  playerList: {
    userId: string;
    profileId: number;
    userName: string;
    avatarUrl: string;
    elo: number | null;
    playerStanding: number;
    isHuman: boolean;
    team: number;
    civName: string;
    winLoss: "Win" | "Loss";
    matchReplayAvailable: boolean;
  }[];
  statusCode: number;
  errorMessage: string | null;
}

export interface FullStatsResponse {
  mpStatList: {
    totalMatches: number;
    totalWins: number;
    currentWinStreak: number;
  };
  careerStats: {
    totalGames: number;
    totalWins: number;
    civilizations: {
      civName: string;
      gamesPlayed: number;
      wins: number;
      losses: number;
    }[];
    highScoreTotal: number;
    highScoreMilitary: number;
    highScoreEconomy: number;
    highScoreTechnology: number;
    unitsKilled: number;
    unitsLost: number;
    buildingsRaised: number;
    buildingsLost: number;
    wondersBuilt: number;
    castlesBuilt: number;
    trebsBuilt: number;
    farmsBuilt: number;
  };
  user: {
    userId: string;
    profileId: number;
    userName: string;
    avatarUrl: string;
    elo: number | null;
    playerStanding: number;
    isHuman: boolean;
    team: number;
    civName: string | null;
    winLoss: string | null;
    matchReplayAvailable: boolean;
  };
  mpMatches: {
    matchList: unknown[];
    totalMatches: number;
  };
  statusCode: number;
  errorMessage: string | null;
}
