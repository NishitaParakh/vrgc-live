import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { ScrollFloat } from '@/components';
import {
  subscribeToLiveConfig,
  subscribeToLiveMatch,
  subscribeToLiveChat,
  sendLiveChatMessage,
  DEFAULT_LIVE_CONFIG,
  DEFAULT_LIVE_MATCH,
} from '@/services/liveService';
import { LiveConfigState, LiveMatchState, LiveChatMessage } from '@/types/live';
import StreamArena from '@/components/live/StreamArena';
import ValorantScoreboard from '@/components/live/ValorantScoreboard';
import TournamentProgressionChart from '@/components/live/TournamentProgressionChart';


type StageData = {
  streamUrl: string;
  team1Name: string;
  team1Tag: string;
  team1Logo: string;
  team2Name: string;
  team2Tag: string;
  team2Logo: string;
  mapName: string;
  scoreVal: string;
  matchTimer: string;
  viewers: string;
  killfeed: Array<{ k: string; w: string; v: string }>;
};

const STAGE_DATA: Record<string, StageData> = {
  stage1: {
    streamUrl: 'https://player.twitch.tv/?channel=riotgames&parent=localhost&parent=vrgcvitb.in',
    team1Name: 'VRGC ALPHA',
    team1Tag: '#1 SEED • VARSITY',
    team1Logo: '/vrgc_logo.jpg',
    team2Name: 'SHADOW ROYALS',
    team2Tag: '#3 SEED • CONTENDER',
    team2Logo: '/event_trophy.jpg',
    mapName: 'MAP 2: BIND',
    scoreVal: '11 : 9',
    matchTimer: 'ROUND 21 • 01:24',
    viewers: '1,420 ONLINE',
    killfeed: [
      { k: 'VRGC Phantom', w: '[Vandal]', v: 'SHD Cypher' },
      { k: 'VRGC Aether', w: '[Operator]', v: 'SHD Jett' },
      { k: 'SHD Viper', w: '[Snakebite]', v: 'VRGC Blade' },
      { k: 'VRGC Rexxar', w: '[Defuse 0.4s]', v: 'ROUND WIN' },
    ],
  },
  stage2: {
    streamUrl: 'https://player.twitch.tv/?channel=pgl&parent=localhost&parent=vrgcvitb.in',
    team1Name: 'TITAN SQUAD',
    team1Tag: '#2 SEED • CS2 ROSTER',
    team1Logo: '/hero_purple.jpg',
    team2Name: 'REAPER ESPORTS',
    team2Tag: '#4 SEED • QUALIFIER',
    team2Logo: '/vrgc_logo.jpg',
    mapName: 'MAP 1: INFERNO',
    scoreVal: '14 : 12',
    matchTimer: 'OVERTIME • 00:45',
    viewers: '980 ONLINE',
    killfeed: [
      { k: 'TITAN Ghost', w: '[AWP]', v: 'REAPER Apex' },
      { k: 'TITAN Neo', w: '[AK-47 HS]', v: 'REAPER Swift' },
      { k: 'REAPER Blade', w: '[Deagle]', v: 'TITAN Helix' },
      { k: 'TITAN Ghost', w: '[Bomb Planted]', v: 'SITE B' },
    ],
  },
  stage3: {
    streamUrl: 'https://player.twitch.tv/?channel=esl_csgo&parent=localhost&parent=vrgcvitb.in',
    team1Name: 'SOUL SURVIVORS',
    team1Tag: 'MATCH 4 • ERANGEL',
    team1Logo: '/event_trophy.jpg',
    team2Name: 'CAMPUS ALL-STARS',
    team2Tag: '25 SQUADS • 42 ALIVE',
    team2Logo: '/hero_purple.jpg',
    mapName: 'ERANGEL: ZONE 5',
    scoreVal: '42 ALIVE',
    matchTimer: 'ZONE COLLAPSE 01:10',
    viewers: '2,150 ONLINE',
    killfeed: [
      { k: 'SOUL Rexxar', w: '[M416]', v: 'GODL Scout' },
      { k: 'SOUL Nomad', w: '[Grenade Knock]', v: 'HYDRA Star' },
      { k: 'ALL-STAR Sky', w: '[Kar98k]', v: 'SOUL Viper' },
      { k: 'SOUL Rexxar', w: '[Squad Wipe]', v: 'WWCD CONTENDER' },
    ],
  },
};

type ChatMessage = {
  badge: 'VANGUARD' | 'VARSITY' | 'CONTENDER' | 'CADET';
  badgeClass: string;
  sender: string;
  content: string;
};

export default function LivePage() {
  useScrollAnimations();

  const [liveConfig, setLiveConfig] = useState<LiveConfigState>(DEFAULT_LIVE_CONFIG);
  const [liveMatch, setLiveMatch] = useState<LiveMatchState>(DEFAULT_LIVE_MATCH);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [currentStageKey, setCurrentStageKey] = useState<string>('stage1');

  const activeMatches =
    liveMatch.matches && liveMatch.matches.length > 0
      ? liveMatch.matches.slice(0, liveMatch.activeMatchCount || liveMatch.matches.length)
      : [];

  // Automatically sync selected match if current selection is invalid or none selected
  useEffect(() => {
    if (activeMatches.length > 0) {
      if (!selectedMatchId || !activeMatches.some((m) => m.id === selectedMatchId)) {
        const featured = activeMatches.find((m) => m.isFeatured);
        setSelectedMatchId(featured ? featured.id : activeMatches[0].id);
      }
    }
  }, [activeMatches, selectedMatchId]);

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    {
      id: 'msg-1',
      badge: 'VANGUARD',
      badgeClass: 'badge-vanguard',
      sender: 'Parardha:',
      content: 'Welcome to the Grand Finals everyone! Make some noise in chat!',
    },
    {
      id: 'msg-2',
      badge: 'VARSITY',
      badgeClass: 'badge-varsity',
      sender: 'Aether:',
      content: 'A-site defense is completely locked down this half!',
    },
    {
      id: 'msg-3',
      badge: 'CONTENDER',
      badgeClass: 'badge-contender',
      sender: 'Krypton:',
      content: 'THAT FLICK FROM PHANTOM WAS DISGUSTING 🔥🔥🔥',
    },
    {
      id: 'msg-4',
      badge: 'CADET',
      badgeClass: 'badge-cadet',
      sender: 'Rookie_09:',
      content: 'First time watching collegiate finals, the production quality is insane!',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Subscribe in real-time to Firestore live configuration and matches
  useEffect(() => {
    const unsubConfig = subscribeToLiveConfig(setLiveConfig);
    const unsubMatch = subscribeToLiveMatch(setLiveMatch);
    const unsubChat = subscribeToLiveChat((msgs) => {
      if (msgs.length > 0) setChatMessages(msgs);
    });
    return () => {
      unsubConfig();
      unsubMatch();
      unsubChat();
    };
  }, []);

  // Apply theme-crimson to document body while on this page
  useEffect(() => {
    document.body.classList.add('theme-crimson');
    return () => {
      document.body.classList.remove('theme-crimson');
    };
  }, []);

  const stage = STAGE_DATA[currentStageKey];

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const content = inputMsg.trim();
    setInputMsg('');

    // Optimistic local update
    setChatMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        badge: 'CADET',
        badgeClass: 'badge-cadet',
        sender: 'You:',
        content,
      },
    ]);

    await sendLiveChatMessage({
      badge: 'CADET',
      badgeClass: 'badge-cadet',
      sender: 'Cadet Spectator',
      content,
    });
  };

  return (
    <>
      <Head>
        <title>Live Arena &amp; Broadcast Network — VRGC VIT Bhopal</title>
        <meta
          name="description"
          content="Official VRGC collegiate esports broadcast network. Live stadium stream, real-time scoreboard, tier-ranked community chat, and match archive."
        />
        <meta name="theme-color" content="#0c0003" />
      </Head>

      <main>
        {/* ══════════════════════════════════════════════════
             FULL RED LIVE ARENA HERO (STAGE & CHAT)
             ══════════════════════════════════════════════════ */}
        <section className="crimson-arena-hero">
          <div className="crimson-glow-backlight"></div>

          <div className="crimson-badge-pill">
            <span className="crimson-dot"></span>
            VRGC BROADCAST NETWORK &bull; STADIUM DESK ACTIVE
          </div>

          <h1
            className="ink-mega-title"
            style={{ marginBottom: '1.25rem', fontSize: 'clamp(3.8rem, 9.5vw, 8rem)' }}
          >
            LIVE <span className="crimson-title-accent">ARENA</span>
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '1.05rem',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Welcome to the central coliseum. High-stakes collegiate grand finals, tactical telemetry,
            real-time match scoreboard, and rank-tier live chat.
          </p>

          <div className="live-arena-wrapper">
            {/* Dynamic Parallel Matches Selector Tabs (Scales automatically with match count) */}
            {activeMatches.length > 0 && (
              <div
                className="filter-bar"
                style={{
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    marginRight: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span>
                  <span>PARALLEL MATCHES ({activeMatches.length}):</span>
                </div>

                {activeMatches.map((m) => {
                  const isSelected = selectedMatchId === m.id;
                  return (
                    <button
                      key={m.id}
                      className={`crimson-filter-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedMatchId(m.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.45rem 1.05rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontWeight: 800, letterSpacing: '0.04em' }}>
                        M{m?.matchNumber}: {m?.team1?.name || 'Team 1'} VS {m?.team2?.name || 'Team 2'}
                      </span>
                      <span
                        style={{
                          padding: '0.12rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? 'rgba(0,0,0,0.6)' : 'rgba(239, 68, 68, 0.25)',
                          color: isSelected ? '#fff' : '#ff4d6d',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          border: isSelected
                            ? '1px solid rgba(255,255,255,0.3)'
                            : '1px solid rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        {m?.team1?.score ?? 0} : {m?.team2?.score ?? 0}
                      </span>
                      {m.isFeatured && (
                        <span style={{ color: '#fbbf24', fontSize: '0.75rem' }} title="Featured Match">
                          ★
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Real-time Valorant VCT Top-Bar HUD (Full Stadium Scoreboard) */}
            <div style={{ marginBottom: '1.5rem', width: '100%' }}>
              <ValorantScoreboard
                match={liveMatch}
                selectedMatchId={selectedMatchId}
                onSelectMatch={setSelectedMatchId}
              />
            </div>

            {/* 2-Column Broadcast Grid: Player/Stream + Live Chat */}
            <div className="live-broadcast-grid">
              {/* Left Column: Stream Arena + Killfeed */}
              <div className="live-player-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minWidth: 0, height: '100%' }}>
                {/* Memoized Multi-Stream Arena with Audio Focus */}
                <StreamArena config={liveConfig} />

                {/* Scrolling Kill-Feed Ticker */}
                <div className="killfeed-strip" id="killFeedStrip">
                  {(liveMatch.killfeed && liveMatch.killfeed.length > 0 ? liveMatch.killfeed : stage.killfeed).map((kf, i) => (
                    <div key={i} className="kf-item">
                      <span className="kf-killer">{kf.k}</span>{' '}
                      <span className="kf-weapon">{kf.w}</span>{' '}
                      <span className="kf-victim">{kf.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Rank-Tiered Live Chat Panel */}
              <div className="live-chat-panel">
                <div className="chat-head">
                  <span className="chat-head-title">ARENA LIVE CHAT</span>
                  <span className="chat-viewers-count" id="chatViewersBadge">
                    {stage.viewers}
                  </span>
                </div>

                {/* Scrollable Message Body */}
                <div className="chat-msgs-body" id="chatMsgsBody">
                  {chatMessages.map((msg, idx) => (
                    <div key={msg.id || idx} className="chat-msg-row">
                      <span className={`chat-badge ${msg.badgeClass}`}>{msg.badge}</span>
                      <span className="chat-sender">{msg.sender}</span>
                      <span className="chat-content">{msg.content}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input Bar */}
                <form className="chat-input-bar" onSubmit={handleSendChat}>
                  <input
                    type="text"
                    className="chat-input"
                    id="chatInput"
                    placeholder="Send a message as Cadet..."
                    required
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn">
                    SEND
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
             CALM NEAR-BLACK SURFACE (BELOW THE FOLD)
             ══════════════════════════════════════════════════ */}
        <section className="calm-arena-section">
          <div className="live-arena-wrapper">
            {/* 1. MINI TOURNAMENT BRACKET VIEWER */}
            <div className="mini-bracket-container">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div className="ink-sec-tag" style={{ color: '#ef4444' }}>
                    <span className="tag-sq" style={{ background: '#ef4444' }}></span> TOURNAMENT
                    ROADMAP
                  </div>
                  <ScrollFloat
                    as="h3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.8rem',
                      color: '#fff',
                      lineHeight: 1,
                      marginTop: '0.35rem',
                    }}
                  >
                    LIVE TOURNAMENT BRACKET
                  </ScrollFloat>
                </div>
                <Link
                  href="/events"
                  className="btn-ink-outline"
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.8rem' }}
                >
                  Full Events &amp; Standings &nbsp;&nearr;
                </Link>
              </div>

              <TournamentProgressionChart matches={liveMatch.matches} />
            </div>

            {/* 2. MATCH ARCHIVE / VOD GRID (6 REPLAYS) */}
            <div style={{ marginBottom: '6rem' }}>
              <div className="ink-sec-tag">
                <span className="tag-sq" style={{ background: '#ef4444' }}></span> ON-DEMAND REPLAYS
              </div>
              <ScrollFloat
                as="h2"
                containerClassName="ipb-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                  marginBottom: '2.5rem',
                  color: '#fff',
                }}
              >
                MATCH ARCHIVE
              </ScrollFloat>

              <div
                className="vod-grid"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
              >
                {/* VOD 1 */}
                <div className="vod-card crimson-card">
                  <div className="vod-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/games/valorant.jpg" alt="VALORANT Semi-Finals" />
                    <span className="vod-duration-badge">2h 14m</span>
                    <div className="play-btn-overlay">
                      <div className="play-circle" style={{ background: '#ef4444' }}>
                        <div className="play-triangle"></div>
                      </div>
                    </div>
                  </div>
                  <div className="vod-info">
                    <h3 className="vod-title" style={{ fontSize: '1.5rem', color: '#fff' }}>
                      VALORANT SEMI-FINALS: VRGC VS MIT
                    </h3>
                    <div className="vod-meta">
                      <span style={{ color: '#ff4d6d' }}>VALORANT &bull; ASCENT</span>
                      <span>DEC 02, 2024</span>
                    </div>
                  </div>
                </div>

                {/* VOD 2 */}
                <div className="vod-card crimson-card">
                  <div className="vod-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/games/bgmi.jpg" alt="BGMI Dominance" />
                    <span className="vod-duration-badge">3h 45m</span>
                    <div className="play-btn-overlay">
                      <div className="play-circle" style={{ background: '#ef4444' }}>
                        <div className="play-triangle"></div>
                      </div>
                    </div>
                  </div>
                  <div className="vod-info">
                    <h3 className="vod-title" style={{ fontSize: '1.5rem', color: '#fff' }}>
                      BGMI ERANGEL DOMINANCE DAY 2
                    </h3>
                    <div className="vod-meta">
                      <span style={{ color: '#ff4d6d' }}>BGMI &bull; ERANGEL</span>
                      <span>NOV 28, 2024</span>
                    </div>
                  </div>
                </div>

                {/* VOD 3 */}
                <div className="vod-card crimson-card">
                  <div className="vod-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/vrgc_logo.jpg" alt="CS2 Upper Bracket" />
                    <span className="vod-duration-badge">1h 38m</span>
                    <div className="play-btn-overlay">
                      <div className="play-circle" style={{ background: '#ef4444' }}>
                        <div className="play-triangle"></div>
                      </div>
                    </div>
                  </div>
                  <div className="vod-info">
                    <h3 className="vod-title" style={{ fontSize: '1.5rem', color: '#fff' }}>
                      CS2 UPPER BRACKET OT THRILLER
                    </h3>
                    <div className="vod-meta">
                      <span style={{ color: '#ff4d6d' }}>CS2 &bull; ANUBIS</span>
                      <span>NOV 25, 2024</span>
                    </div>
                  </div>
                </div>

                {/* VOD 4 */}
                <div className="vod-card crimson-card">
                  <div className="vod-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/events/blackbox.jpg" alt="BlackBox VR Jam" />
                    <span className="vod-duration-badge">1h 12m</span>
                    <div className="play-btn-overlay">
                      <div className="play-circle" style={{ background: '#ef4444' }}>
                        <div className="play-triangle"></div>
                      </div>
                    </div>
                  </div>
                  <div className="vod-info">
                    <h3 className="vod-title" style={{ fontSize: '1.5rem', color: '#fff' }}>
                      VR GAME JAM 48H FINAL PROTOTYPES
                    </h3>
                    <div className="vod-meta">
                      <span style={{ color: '#ff4d6d' }}>VR DEV &bull; QUEST 3</span>
                      <span>NOV 18, 2024</span>
                    </div>
                  </div>
                </div>

                {/* VOD 5 */}
                <div className="vod-card crimson-card">
                  <div className="vod-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/games/fifa.jpg" alt="EA FC 25 Derby" />
                    <span className="vod-duration-badge">42m</span>
                    <div className="play-btn-overlay">
                      <div className="play-circle" style={{ background: '#ef4444' }}>
                        <div className="play-triangle"></div>
                      </div>
                    </div>
                  </div>
                  <div className="vod-info">
                    <h3 className="vod-title" style={{ fontSize: '1.5rem', color: '#fff' }}>
                      EA FC 25 CAMPUS DERBY GRAND FINALS
                    </h3>
                    <div className="vod-meta">
                      <span style={{ color: '#ff4d6d' }}>EA FC 25 &bull; 1v1</span>
                      <span>NOV 14, 2024</span>
                    </div>
                  </div>
                </div>

                {/* VOD 6 */}
                <div className="vod-card crimson-card">
                  <div className="vod-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/events/gamers_asylum.jpg" alt="Gamer's Asylum" />
                    <span className="vod-duration-badge">55m</span>
                    <div className="play-btn-overlay">
                      <div className="play-circle" style={{ background: '#ef4444' }}>
                        <div className="play-triangle"></div>
                      </div>
                    </div>
                  </div>
                  <div className="vod-info">
                    <h3 className="vod-title" style={{ fontSize: '1.5rem', color: '#fff' }}>
                      GAMER&apos;S ASYLUM MEGA ARENA HIGHLIGHTS
                    </h3>
                    <div className="vod-meta">
                      <span style={{ color: '#ff4d6d' }}>LAN &bull; FINALS</span>
                      <span>NOV 08, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. UPCOMING BROADCASTS SCHEDULE */}
            <div style={{ marginBottom: '6rem' }}>
              <div className="ink-sec-tag">
                <span className="tag-sq" style={{ background: '#ef4444' }}></span> BROADCAST RUN
                SHEET
              </div>
              <ScrollFloat
                as="h2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: '2rem',
                }}
              >
                UPCOMING SCHEDULE
              </ScrollFloat>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  className="schedule-row-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '1.25rem 2rem',
                    borderRadius: '8px',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: '#ef4444',
                        fontWeight: 700,
                      }}
                    >
                      STAGE 02 &bull; TODAY 17:30 IST
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.6rem',
                        color: '#fff',
                        marginTop: '0.2rem',
                      }}
                    >
                      BGMI SUPER SERIES // FINALS ERANGEL &amp; MIRAMAR
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--white-muted)' }}>
                      Top 25 Collegiate Squads battling for ₹2,00,000 seasonal points.
                    </p>
                  </div>
                  <button
                    className="gta-tab-btn"
                    onClick={() => alert('Reminder set for BGMI Finals!')}
                  >
                    SET REMINDER
                  </button>
                </div>

                <div
                  className="schedule-row-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '1.25rem 2rem',
                    borderRadius: '8px',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: '#60a5fa',
                        fontWeight: 700,
                      }}
                    >
                      STAGE 03 &bull; TODAY 20:00 IST
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.6rem',
                        color: '#fff',
                        marginTop: '0.2rem',
                      }}
                    >
                      CS2 INTER-COLLEGIATE CLASH // UPPER BRACKET
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--white-muted)' }}>
                      Double elimination bracket MR12 regulation play.
                    </p>
                  </div>
                  <button
                    className="gta-tab-btn"
                    onClick={() => alert('Reminder set for CS2 Match!')}
                  >
                    SET REMINDER
                  </button>
                </div>

                <div
                  className="schedule-row-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '1.25rem 2rem',
                    borderRadius: '8px',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: '#ffd700',
                        fontWeight: 700,
                      }}
                    >
                      STAGE 01 &bull; TOMORROW 18:00 IST
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.6rem',
                        color: '#fff',
                        marginTop: '0.2rem',
                      }}
                    >
                      VR GAME JAM // 48-HOUR FINAL DEMO REVEAL
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--white-muted)' }}>
                      Live spatial hardware testing on Meta Quest 3 with industry guest judges.
                    </p>
                  </div>
                  <button
                    className="gta-tab-btn"
                    onClick={() => alert('Reminder set for VR Game Jam!')}
                  >
                    SET REMINDER
                  </button>
                </div>
              </div>
            </div>

            {/* 4. CASTER DESK COMMENTARY TEAM */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div className="ink-sec-tag" style={{ justifyContent: 'center' }}>
                <span className="tag-sq" style={{ background: '#ef4444' }}></span> ON-AIR COMMENTARY
              </div>
              <ScrollFloat
                as="h2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: '3rem',
                }}
              >
                THE CASTER DESK
              </ScrollFloat>

              <div
                className="circular-team-grid"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '2rem',
                  maxWidth: '960px',
                  margin: '0 auto',
                }}
              >
                <div className="circ-member-card">
                  <div className="circ-avatar-wrap">
                    <div className="circ-ring" style={{ borderColor: 'rgba(239,68,68,0.4)' }}></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/event_trophy.jpg"
                      alt="Caster Aether"
                      className="circ-avatar"
                      style={{ borderColor: '#ef4444' }}
                    />
                  </div>
                  <h3 className="circ-name" style={{ color: '#fff', fontSize: '1.6rem' }}>
                    AETHER
                  </h3>
                  <span className="circ-role" style={{ color: '#ff4d6d' }}>
                    Lead Play-by-Play
                  </span>
                  <p className="circ-bio" style={{ color: 'var(--white-muted)' }}>
                    High-energy tactical FPS shoutcaster. Covered over 150 collegiate games with
                    electric energy.
                  </p>
                </div>

                <div className="circ-member-card">
                  <div className="circ-avatar-wrap">
                    <div className="circ-ring" style={{ borderColor: 'rgba(239,68,68,0.4)' }}></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hero_purple.jpg"
                      alt="Caster Vortex"
                      className="circ-avatar"
                      style={{ borderColor: '#ef4444' }}
                    />
                  </div>
                  <h3 className="circ-name" style={{ color: '#fff', fontSize: '1.6rem' }}>
                    VORTEX
                  </h3>
                  <span className="circ-role" style={{ color: '#ff4d6d' }}>
                    Color Analyst
                  </span>
                  <p className="circ-bio" style={{ color: 'var(--white-muted)' }}>
                    Ex-radiant collegiate player breaking down utility timings, eco rounds, and
                    micro-positioning.
                  </p>
                </div>

                <div className="circ-member-card">
                  <div className="circ-avatar-wrap">
                    <div className="circ-ring" style={{ borderColor: 'rgba(239,68,68,0.4)' }}></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vrgc_logo.jpg"
                      alt="Observer Ghost"
                      className="circ-avatar"
                      style={{ borderColor: '#ef4444' }}
                    />
                  </div>
                  <h3 className="circ-name" style={{ color: '#fff', fontSize: '1.6rem' }}>
                    GHOST
                  </h3>
                  <span className="circ-role" style={{ color: '#ff4d6d' }}>
                    Head Observer
                  </span>
                  <p className="circ-bio" style={{ color: 'var(--white-muted)' }}>
                    Directing in-game cinematic free-cams, instant slow-motion replays, and catching
                    every entry frag.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
