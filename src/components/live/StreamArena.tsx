import React, { useState, memo } from "react";
import { LiveConfigState, LiveStreamFeed } from "@/types/live";

// ── Memoized Single YouTube Player ───────────────────────────────────
// Isolated from parent score updates to prevent video reloads or buffering.
interface YouTubePlayerProps {
  youtubeId: string;
  isMuted: boolean;
  title: string;
}

const YouTubePlayer = memo(function YouTubePlayer({
  youtubeId,
  isMuted,
  title,
}: YouTubePlayerProps) {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=${
    isMuted ? 1 : 0
  }&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        backgroundColor: "#000",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(239, 68, 68, 0.4)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
      }}
    >
      <iframe
        src={embedUrl}
        title={title}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
});

// ── Master Stream Arena Component ────────────────────────────────────
interface StreamArenaProps {
  config: LiveConfigState;
}

export default function StreamArena({ config }: StreamArenaProps) {
  const [selectedFeedIndex, setSelectedFeedIndex] = useState<number>(0);

  const activeStreams: LiveStreamFeed[] = (config?.streams || []).filter((s) => s?.isActive);

  // Standby / Offline Screen
  if (!config?.isLive || config?.broadcastState === "offline") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "12px",
          backgroundColor: "#090106",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
        }}
      >
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "var(--white-muted, #94a3b8)",
            fontFamily: "var(--font-mono)",
            marginBottom: "1rem",
          }}
        >
          STANDBY MODE
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.4rem",
            color: "#fff",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          BROADCAST CURRENTLY OFFLINE
        </h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--white-muted, #94a3b8)",
            maxWidth: "460px",
            lineHeight: 1.5,
          }}
        >
          The production desk is preparing for the next match. Stay tuned or join the spectator chat!
        </p>
      </div>
    );
  }

  // Stream Starting Soon
  if (config.broadcastState === "starting_soon") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "12px",
          backgroundColor: "#0d0408",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            backgroundColor: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            color: "#fbbf24",
            fontFamily: "var(--font-mono)",
            marginBottom: "1rem",
          }}
        >
          STARTING SOON
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.4rem",
            color: "#fff",
            letterSpacing: "0.05em",
          }}
        >
          MATCH STARTING MOMENTARILY
        </h2>
      </div>
    );
  }

  // Fallback if no streams active
  if (activeStreams.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "12px",
          backgroundColor: "#000",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--white-muted, #94a3b8)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
        }}
      >
        No active stream feeds available
      </div>
    );
  }

  const currentStream = activeStreams[selectedFeedIndex] || activeStreams[0] || {
    id: "default-stream",
    title: "Main Broadcast Stream",
    youtubeId: "dQw4w9WgXcQ",
    isActive: true,
    order: 1,
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
      {/* ── Multi-Stream Switcher Tabs (Shown when >1 stream is available) ── */}
      {activeStreams.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            padding: "0.5rem 0.85rem",
            borderRadius: "8px",
            backgroundColor: "rgba(13, 1, 6, 0.8)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "rgba(255, 255, 255, 0.7)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <span>Active Video Feed:</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {activeStreams.map((stream, idx) => (
              <button
                key={stream.id}
                onClick={() => setSelectedFeedIndex(idx)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor:
                    selectedFeedIndex === idx ? "#ef4444" : "rgba(255, 255, 255, 0.06)",
                  color: selectedFeedIndex === idx ? "#fff" : "rgba(255, 255, 255, 0.65)",
                  border:
                    selectedFeedIndex === idx
                      ? "1px solid #ef4444"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                Feed {idx + 1}: {stream.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Stream Title & Live Status Bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.45rem 0.85rem",
          borderRadius: "8px",
          backgroundColor: "rgba(13, 1, 6, 0.85)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", overflow: "hidden" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              boxShadow: "0 0 8px #ef4444",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentStream.title || "Main Broadcast Stream"}
          </span>
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "#ff4d6d",
            letterSpacing: "0.08em",
            fontWeight: 700,
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          ● YOUTUBE LIVE
        </span>
      </div>

      {/* ── Strict Single Video Player ── */}
      <div style={{ width: "100%" }}>
        <YouTubePlayer
          youtubeId={currentStream.youtubeId}
          isMuted={false}
          title={currentStream.title}
        />
      </div>
    </div>
  );
}
