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

export interface GuildResponse {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  home_header: string | null;
  splash: string | null;
  discovery_splash: string | null;
  features: string[];
  banner: string | null;
  owner_id: string;
  application_id: string | null;
  region: string;
  afk_channel_id: string | null;
  afk_timeout: number;
  system_channel_id: string;
  system_channel_flags: number;
  widget_enabled: boolean;
  widget_channel_id: string | null;
  verification_level: number;
  verification_role_id: string | null;
  roles: {
    id: string;
    name: string;
    description: string | null;
    permissions: string;
    position: number;
    color: number;
    colors: {
      primary_color?: number;
      secondary_color?: number;
      tertiary_color?: number;
    };
    hoist: boolean;
    managed: boolean;
    mentionable: boolean;
    icon: string | null;
    unicode_emoji: string | null;
    flags: number;
  }[];
  default_message_notifications: number;
  mfa_level: number;
  explicit_content_filter: number;
  max_presences: number | null;
  max_members: number;
  max_stage_video_channel_users: number;
  max_video_channel_users: number;
  vanity_url_code: string | null;
  premium_tier: number;
  premium_subscription_count: number;
  preferred_locale: string;
  rules_channel_id: string | null;
  safety_alerts_channel_id: string | null;
  public_updates_channel_id: string | null;
  hub_type: string | null;
  premium_progress_bar_enabled: boolean;
  premium_progress_bar_enabled_user_updated_at: string | null;
  latest_onboarding_question_id: string | null;
  nsfw: boolean;
  nsfw_level: number;
  owner_configured_content_level: number;
  emojis: {
    id?: string;
    name?: string;
  }[];
  stickers: {
    id?: string;
    name?: string;
  }[];
  incidents_data: unknown | null;
  inventory_settings: unknown | null;
  official_message_color: string | null;
  theme: string | null;
  embed_enabled: boolean;
  embed_channel_id: string | null;
}
