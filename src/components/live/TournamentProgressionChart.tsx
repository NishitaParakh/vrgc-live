import React from "react";
import { ParallelMatch } from "@/types/live";

interface TournamentProgressionChartProps {
  matches?: ParallelMatch[];
}

export default function TournamentProgressionChart({
  matches = [],
}: TournamentProgressionChartProps) {
  const qfMatches = matches.filter((m) => m.stage === "Quarter-Finals");
  const sfMatches = matches.filter((m) => m.stage === "Semi-Finals");
  const gfMatches = matches.filter((m) => m.stage === "Grand Finals");

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "14px",
        backgroundColor: "#0d0106",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            TOURNAMENT STAGE PROGRESSION
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--white-muted, #94a3b8)",
              marginTop: "0.2rem",
            }}
          >
            Road to Championship — Quarter-Finals &rarr; Semi-Finals &rarr; Grand Finals
          </p>
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "#4ade80",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          ● Real-Time Sync Active
        </span>
      </div>

      {/* ── 3-Stage Columns Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* Stage 1: Quarter-Finals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#a5b4fc",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Stage 1: Quarter-Finals
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {qfMatches.length > 0 ? (
              qfMatches.map((m) => <BracketCard key={m.id} match={m} />)
            ) : (
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: "1px dashed rgba(255, 255, 255, 0.1)",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "var(--white-muted, #94a3b8)",
                }}
              >
                Matches scheduled for Stage 1
              </div>
            )}
          </div>
        </div>

        {/* Stage 2: Semi-Finals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              backgroundColor: "rgba(168, 85, 247, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#d8b4fe",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Stage 2: Semi-Finals
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sfMatches.length > 0 ? (
              sfMatches.map((m) => <BracketCard key={m.id} match={m} />)
            ) : (
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: "1px dashed rgba(255, 255, 255, 0.1)",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "var(--white-muted, #94a3b8)",
                }}
              >
                Awaiting Quarter-Final winners
              </div>
            )}
          </div>
        </div>

        {/* Stage 3: Grand Finals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.45)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#fde68a",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Stage 3: Grand Finals
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {gfMatches.length > 0 ? (
              gfMatches.map((m) => <BracketCard key={m.id} match={m} isFinals={true} />)
            ) : (
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: "1px dashed rgba(255, 255, 255, 0.1)",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "var(--white-muted, #94a3b8)",
                }}
              >
                Championship match pending
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BracketCard({
  match,
  isFinals = false,
}: {
  match: ParallelMatch;
  isFinals?: boolean;
}) {
  const t1 = match?.team1 || { name: "Team 1", side: "ATK" as const, mapsWon: 0, score: 0 };
  const t2 = match?.team2 || { name: "Team 2", side: "DEF" as const, mapsWon: 0, score: 0 };
  const isMatchLive = (t1.score || 0) > 0 || (t2.score || 0) > 0 || !!match?.isFeatured;

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "10px",
        backgroundColor: isFinals
          ? "#180918"
          : isMatchLive
          ? "#14040c"
          : "rgba(10, 2, 6, 0.8)",
        border: isFinals
          ? "1px solid rgba(245, 158, 11, 0.5)"
          : isMatchLive
          ? "1px solid rgba(239, 68, 68, 0.45)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.7rem",
          fontFamily: "var(--font-mono)",
          color: "var(--white-muted, #94a3b8)",
        }}
      >
        <span style={{ fontWeight: 700, color: "#fff" }}>MATCH {match.matchNumber}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ color: "#c084fc" }}>{match.mapName}</span>
          <span>•</span>
          <span>{match.seriesFormat}</span>
          {isMatchLive && (
            <span
              style={{
                padding: "0.1rem 0.4rem",
                borderRadius: "4px",
                fontSize: "0.62rem",
                fontWeight: 900,
                backgroundColor: "rgba(239, 68, 68, 0.25)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.5)",
              }}
            >
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Team 1 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.65rem",
          borderRadius: "6px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
          <span
            style={{
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              color: t1.side === "ATK" ? "#ef4444" : "#22d3ee",
            }}
          >
            {t1.side}
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#fff",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {t1.name}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--white-muted)" }}>
            {t1.mapsWon}W
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              color: "#fff",
              padding: "0.1rem 0.5rem",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              lineHeight: 1,
            }}
          >
            {t1.score}
          </span>
        </div>
      </div>

      {/* Team 2 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.65rem",
          borderRadius: "6px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
          <span
            style={{
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              color: t2.side === "ATK" ? "#ef4444" : "#22d3ee",
            }}
          >
            {t2.side}
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#fff",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {t2.name}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--white-muted)" }}>
            {t2.mapsWon}W
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              color: "#fff",
              padding: "0.1rem 0.5rem",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              lineHeight: 1,
            }}
          >
            {t2.score}
          </span>
        </div>
      </div>
    </div>
  );
}
