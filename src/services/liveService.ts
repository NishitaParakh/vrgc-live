import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { formDb } from "@/utils/firebase/client";
import {
  LiveConfigState,
  LiveMatchState,
  LiveChatMessage,
} from "@/types/live";

export const DEFAULT_LIVE_CONFIG: LiveConfigState = {
  isLive: true,
  broadcastState: "live",
  layoutMode: "single",
  activeStreamIndex: 0,
  streams: [
    {
      id: "stream-1",
      title: "Main Broadcast Stream",
      youtubeId: "dQw4w9WgXcQ",
      isActive: true,
      order: 1,
    },
  ],
};

export const DEFAULT_LIVE_MATCH: LiveMatchState = {
  gameType: "valorant",
  tournamentName: "VRGC Campus Invitational",
  seriesFormat: "BO3",
  currentMap: "Ascent",
  currentMapNumber: 1,
  totalMaps: 3,
  phase: "first_half",
  activeTimeoutTeamId: null,
  status: "live",
  showScoreboard: true,
  activeMatchCount: 2,
  featuredMatchId: "match-1",
  team1: {
    id: "team-1",
    name: "VRGC Alpha",
    tag: "VRGC",
    logo: "/assets/teams/team_attackers.svg",
    side: "ATK",
    score: 0,
    mapsWon: 0,
    timeoutsRemaining: 2,
    accentColor: "#ff4655",
  },
  team2: {
    id: "team-2",
    name: "Shadow Royals",
    tag: "SHD",
    logo: "/assets/teams/team_defenders.svg",
    side: "DEF",
    score: 0,
    mapsWon: 0,
    timeoutsRemaining: 2,
    accentColor: "#00f0ff",
  },
  matches: [
    {
      id: "match-1",
      matchNumber: 1,
      stage: "Semi-Finals",
      isFeatured: true,
      status: "live",
      mapName: "Ascent",
      seriesFormat: "BO3",
      currentMapNumber: 1,
      totalMaps: 3,
      phase: "first_half",
      activeTimeoutTeamId: null,
      team1: {
        id: "m1-t1",
        name: "VRGC Alpha",
        tag: "VRGC",
        logo: "/assets/teams/team_attackers.svg",
        side: "ATK",
        score: 0,
        mapsWon: 0,
        timeoutsRemaining: 2,
        accentColor: "#ff4655",
      },
      team2: {
        id: "m1-t2",
        name: "Shadow Royals",
        tag: "SHD",
        logo: "/assets/teams/team_defenders.svg",
        side: "DEF",
        score: 0,
        mapsWon: 0,
        timeoutsRemaining: 2,
        accentColor: "#00f0ff",
      },
    },
    {
      id: "match-2",
      matchNumber: 2,
      stage: "Semi-Finals",
      isFeatured: false,
      status: "live",
      mapName: "Bind",
      seriesFormat: "BO3",
      currentMapNumber: 1,
      totalMaps: 3,
      phase: "first_half",
      activeTimeoutTeamId: null,
      team1: {
        id: "m2-t1",
        name: "Titan Squad",
        tag: "TITAN",
        logo: "/assets/teams/team_attackers.svg",
        side: "ATK",
        score: 0,
        mapsWon: 0,
        timeoutsRemaining: 2,
        accentColor: "#ff4655",
      },
      team2: {
        id: "m2-t2",
        name: "Reaper Esports",
        tag: "REAP",
        logo: "/assets/teams/team_defenders.svg",
        side: "DEF",
        score: 0,
        mapsWon: 0,
        timeoutsRemaining: 2,
        accentColor: "#00f0ff",
      },
    },
  ],
  killfeed: [
    { k: "VRGC Phantom", w: "[Vandal]", v: "SHD Cypher" },
    { k: "VRGC Aether", w: "[Operator]", v: "SHD Jett" },
    { k: "SHD Viper", w: "[Snakebite]", v: "VRGC Blade" },
    { k: "VRGC Rexxar", w: "[Defuse 0.4s]", v: "ROUND WIN" },
  ],
};

/**
 * Subscribes in real time to the live stream broadcast configuration.
 */
export function subscribeToLiveConfig(
  callback: (config: LiveConfigState) => void
): () => void {
  try {
    const unsub = onSnapshot(
      doc(formDb, "live_config", "global"),
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as LiveConfigState);
        } else {
          callback(DEFAULT_LIVE_CONFIG);
        }
      },
      (error) => {
        console.warn("Firestore live_config subscription fallback active:", error);
        callback(DEFAULT_LIVE_CONFIG);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Firestore live_config error, using fallback:", err);
    callback(DEFAULT_LIVE_CONFIG);
    return () => {};
  }
}

/**
 * Subscribes in real time to live match data, round scores, and side assignments.
 */
export function subscribeToLiveMatch(
  callback: (match: LiveMatchState) => void
): () => void {
  try {
    const unsub = onSnapshot(
      doc(formDb, "live_matches", "current"),
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as LiveMatchState);
        } else {
          callback(DEFAULT_LIVE_MATCH);
        }
      },
      (error) => {
        console.warn("Firestore live_matches subscription fallback active:", error);
        callback(DEFAULT_LIVE_MATCH);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Firestore live_matches error, using fallback:", err);
    callback(DEFAULT_LIVE_MATCH);
    return () => {};
  }
}

/**
 * Subscribes in real time to spectator chat messages.
 */
export function subscribeToLiveChat(
  callback: (messages: LiveChatMessage[]) => void
): () => void {
  try {
    const chatQuery = query(
      collection(formDb, "live_chat"),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsub = onSnapshot(
      chatQuery,
      (snapshot) => {
        const msgs: LiveChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgs.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        callback(msgs);
      },
      (error) => {
        console.warn("Firestore live_chat subscription fallback active:", error);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Firestore live_chat error:", err);
    return () => {};
  }
}

/**
 * Dispatches a spectator chat message to Firestore.
 */
export async function sendLiveChatMessage(
  message: Omit<LiveChatMessage, "id" | "timestamp">
): Promise<void> {
  try {
    await addDoc(collection(formDb, "live_chat"), {
      ...message,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to send chat message:", err);
  }
}

