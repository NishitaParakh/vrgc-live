import React, { useState } from "react";
import { LiveMatchState, ParallelMatch } from "@/types/live";

interface ValorantScoreboardProps {
  match: LiveMatchState;
  selectedMatchId?: string | null;
  onSelectMatch?: (id: string) => void;
}

export default function ValorantScoreboard({
  match,
  selectedMatchId: externalSelectedMatchId,
  onSelectMatch,
}: ValorantScoreboardProps) {
  const [internalSelectedMatchId, setInternalSelectedMatchId] = useState<string | null>(null);

  if (!match.showScoreboard) return null;

  const matches: ParallelMatch[] =
    match.matches && match.matches.length > 0
      ? match.matches.slice(0, match.activeMatchCount || match.matches.length)
      : [];

  const currentSelectedId =
    externalSelectedMatchId !== undefined ? externalSelectedMatchId : internalSelectedMatchId;

  const handleSelectMatch = (id: string) => {
    if (onSelectMatch) {
      onSelectMatch(id);
    } else {
      setInternalSelectedMatchId(id);
    }
  };

  // Determine active displayed match (selected tab, featured match, or root match)
  const activeMatch: any =
    matches.length > 0
      ? matches.find((m) => m.id === currentSelectedId) ||
        matches.find((m) => m.isFeatured) ||
        matches[0]
      : match;

  const team1 = activeMatch?.team1 || match?.team1 || {
    id: "team-1",
    name: "VRGC Alpha",
    tag: "VRGC",
    logo: "/vrgc_logo.jpg",
    side: "ATK" as const,
    score: 0,
    mapsWon: 0,
    timeoutsRemaining: 2,
    accentColor: "#ff4655",
  };
  const team2 = activeMatch?.team2 || match?.team2 || {
    id: "team-2",
    name: "Shadow Royals",
    tag: "SHD",
    logo: "/event_trophy.jpg",
    side: "DEF" as const,
    score: 0,
    mapsWon: 0,
    timeoutsRemaining: 2,
    accentColor: "#00f0ff",
  };
  const currentMap = activeMatch?.mapName || activeMatch?.currentMap || match?.currentMap || "Ascent";
  const currentMapNumber = activeMatch?.currentMapNumber || match?.currentMapNumber || 1;
  const totalMaps = activeMatch?.totalMaps || match?.totalMaps || 3;
  const seriesFormat = activeMatch?.seriesFormat || match?.seriesFormat || "BO3";
  const stage = activeMatch?.stage || "";

  const totalRoundsPlayed = (team1.score || 0) + (team2.score || 0);
  const currentRoundNumber = totalRoundsPlayed + 1;

  const isMatchPoint =
    ((team1.score || 0) >= 12 || (team2.score || 0) >= 12) &&
    Math.abs((team1.score || 0) - (team2.score || 0)) >= 1;
  const isOvertime = (team1.score || 0) >= 12 && (team2.score || 0) >= 12;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
      {/* ── Parallel Matches Switcher Tabs (Shown when >1 match is active) ── */}
      {matches.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            overflowX: "auto",
            padding: "0.4rem 0.65rem",
            backgroundColor: "rgba(13, 1, 6, 0.7)",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "var(--white-muted, #94a3b8)",
              whiteSpace: "nowrap",
            }}
          >
            PARALLEL MATCHES:
          </span>
          {matches.map((m) => {
            const isSelected = (activeMatch as ParallelMatch).id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMatch(m.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#ef4444" : "rgba(255, 255, 255, 0.05)",
                  color: isSelected ? "#fff" : "rgba(255, 255, 255, 0.7)",
                  border: isSelected ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.2s ease",
                }}
              >
                <span>M{m.matchNumber}: {m.stage || "Match"}</span>
                <span
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    color: isSelected ? "#fff" : "#ff4d6d",
                  }}
                >
                  {m?.team1?.score ?? 0} : {m?.team2?.score ?? 0}
                </span>
                {m.isFeatured && <span style={{ color: "#fbbf24" }}>★</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Native Stadium Scoreboard Strip ── */}
      <div className="stadium-scoreboard" id="stadiumScoreboard">
        {/* Team 1 (Left) */}
        <div className="sb-team">
          {/* Photo Section with integrated Attackers/Defenders Badge */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "10px",
                overflow: "hidden",
                border: `2px solid ${team1.side === "ATK" ? "#ef4444" : "#06b6d4"}`,
                boxShadow: `0 0 12px ${team1.side === "ATK" ? "rgba(239, 68, 68, 0.4)" : "rgba(6, 182, 212, 0.4)"}`,
                backgroundColor: "#130308",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  team1.logo && !team1.logo.includes("vrgc_logo.jpg") && !team1.logo.includes("event_trophy.jpg")
                    ? team1.logo
                    : team1.side === "ATK"
                    ? "/assets/teams/team_attackers.svg"
                    : "/assets/teams/team_defenders.svg"
                }
                alt={team1.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            {/* Attackers / Defenders Badge in Photo Section Only */}
            <span
              style={{
                marginTop: "-8px",
                padding: "0.1rem 0.45rem",
                borderRadius: "4px",
                fontSize: "0.58rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                backgroundColor: team1.side === "ATK" ? "#ef4444" : "#06b6d4",
                color: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
                zIndex: 2,
              }}
            >
              {team1.side === "ATK" ? "ATTACKERS" : "DEFENDERS"}
            </span>
          </div>

          <div>
            <h4 className="sb-team-name">{team1.name}</h4>
            {team1.captain && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  marginTop: "0.15rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "#ffd700",
                }}
              >
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    padding: "0.05rem 0.3rem",
                    borderRadius: "3px",
                    backgroundColor: "rgba(255, 215, 0, 0.15)",
                    border: "1px solid rgba(255, 215, 0, 0.4)",
                    letterSpacing: "0.08em",
                  }}
                >
                  CPT
                </span>
                <span>{team1.captain}</span>
              </div>
            )}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "var(--white-muted, #94a3b8)",
                marginTop: "0.2rem",
              }}
            >
              SERIES: {team1.mapsWon || 0} W
            </div>
          </div>
        </div>

        {/* Center Match Stats */}
        <div className="sb-center">
          <div className="sb-map-label">
            {stage ? `${stage} • ` : ""}
            {currentMap} ({seriesFormat})
          </div>
          <div className="sb-score-num">
            {team1.score} : {team2.score}
          </div>
          <div className="sb-timer-wrap">
            {activeMatch.activeTimeoutTeamId ? (
              <span style={{ color: "#fbbf24", fontWeight: 700 }}>TACTICAL TIMEOUT</span>
            ) : isOvertime ? (
              <span style={{ color: "#ef4444", fontWeight: 700 }}>OVERTIME</span>
            ) : isMatchPoint ? (
              <span style={{ color: "#c084fc", fontWeight: 700 }}>MATCH POINT</span>
            ) : (
              <span>
                ROUND {currentRoundNumber} • MAP {currentMapNumber}/{totalMaps}
              </span>
            )}
          </div>
        </div>

        {/* Team 2 (Right) */}
        <div className="sb-team sb-right">
          {/* Photo Section with integrated Attackers/Defenders Badge */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "10px",
                overflow: "hidden",
                border: `2px solid ${team2.side === "ATK" ? "#ef4444" : "#06b6d4"}`,
                boxShadow: `0 0 12px ${team2.side === "ATK" ? "rgba(239, 68, 68, 0.4)" : "rgba(6, 182, 212, 0.4)"}`,
                backgroundColor: "#040c17",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  team2.logo && !team2.logo.includes("vrgc_logo.jpg") && !team2.logo.includes("event_trophy.jpg")
                    ? team2.logo
                    : team2.side === "ATK"
                    ? "/assets/teams/team_attackers.svg"
                    : "/assets/teams/team_defenders.svg"
                }
                alt={team2.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            {/* Attackers / Defenders Badge in Photo Section Only */}
            <span
              style={{
                marginTop: "-8px",
                padding: "0.1rem 0.45rem",
                borderRadius: "4px",
                fontSize: "0.58rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                backgroundColor: team2.side === "ATK" ? "#ef4444" : "#06b6d4",
                color: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
                zIndex: 2,
              }}
            >
              {team2.side === "ATK" ? "ATTACKERS" : "DEFENDERS"}
            </span>
          </div>

          <div>
            <h4 className="sb-team-name">{team2.name}</h4>
            {team2.captain && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.35rem",
                  marginTop: "0.15rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "#ffd700",
                }}
              >
                <span>{team2.captain}</span>
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    padding: "0.05rem 0.3rem",
                    borderRadius: "3px",
                    backgroundColor: "rgba(255, 215, 0, 0.15)",
                    border: "1px solid rgba(255, 215, 0, 0.4)",
                    letterSpacing: "0.08em",
                  }}
                >
                  CPT
                </span>
              </div>
            )}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "var(--white-muted, #94a3b8)",
                marginTop: "0.2rem",
              }}
            >
              SERIES: {team2.mapsWon || 0} W
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
