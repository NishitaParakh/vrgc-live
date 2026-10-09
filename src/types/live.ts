export interface LiveStreamFeed {
  id: string;
  title: string;
  youtubeId: string;
  isActive: boolean;
  order: number;
}

export interface LiveConfigState {
  isLive: boolean;
  broadcastState: "live" | "starting_soon" | "offline";
  layoutMode: "auto" | "single" | "split-2" | "quad-4";
  activeStreamIndex: number;
  streams: LiveStreamFeed[];
  updatedAt?: any;
}

export interface TeamScoreState {
  id: string;
  name: string;
  tag: string;
  captain?: string;
  logo: string;
  side: "ATK" | "DEF";
  score: number;
  mapsWon: number;
  timeoutsRemaining: number;
  accentColor: string;
}

export interface ParallelMatch {
  id: string;
  matchNumber: number;
  stage: "Quarter-Finals" | "Semi-Finals" | "Grand Finals" | "Placement" | string;
  isFeatured: boolean;
  status: "upcoming" | "live" | "paused" | "ended";
  mapName: string;
  seriesFormat: "BO1" | "BO3" | "BO5";
  currentMapNumber: number;
  totalMaps: number;
  phase: "first_half" | "halftime" | "second_half" | "overtime" | "timeout" | "ended";
  activeTimeoutTeamId: string | null;
  team1: TeamScoreState;
  team2: TeamScoreState;
}

export interface LiveMatchState {
  gameType: string;
  tournamentName: string;
  seriesFormat: "BO1" | "BO3" | "BO5";
  currentMap: string;
  currentMapNumber: number;
  totalMaps: number;
  phase: "first_half" | "halftime" | "second_half" | "overtime" | "timeout" | "ended";
  activeTimeoutTeamId: string | null;
  status: "upcoming" | "live" | "paused" | "ended";
  showScoreboard: boolean;
  team1: TeamScoreState;
  team2: TeamScoreState;
  activeMatchCount?: number;
  featuredMatchId?: string;
  matches?: ParallelMatch[];
  killfeed?: Array<{ k: string; w: string; v: string }>;
  updatedAt?: any;
}

export interface LiveChatMessage {
  id: string;
  badge: "VANGUARD" | "VARSITY" | "CONTENDER" | "CADET";
  badgeClass: string;
  sender: string;
  content: string;
  timestamp?: any;
}
