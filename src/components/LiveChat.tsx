import { useState, useEffect, useRef } from 'react';
import { YouTubeLiveChatService, YouTubeChatMessage } from '../services/youtubeChat';

interface LiveChatProps {
  youtubeVideoId?: string;
  className?: string;
}

interface DisplayMessage {
  id: string;
  content: string;
  sender: string;
  badge: 'VANGUARD' | 'VARSITY' | 'CONTENDER' | 'CADET';
  source: 'youtube' | 'local';
  timestamp: string;
}

export default function LiveChat({ youtubeVideoId, className = '' }: LiveChatProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [anonymousUsername] = useState(() => {
    // Generate a simple gaming username
    const adjectives = ['Silent', 'Swift', 'Cyber', 'Neon', 'Digital', 'Quantum', 'Shadow', 'Blade'];
    const nouns = ['Warrior', 'Gamer', 'Pilot', 'Agent', 'Hunter', 'Raider', 'Scout', 'Striker'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    return `${randomAdjective}${randomNoun}${randomNumber}`;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1420);
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  
  const chatService = useRef<YouTubeLiveChatService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const pageTokenRef = useRef<string | undefined>(undefined);

  // Initialize with some default messages
  useEffect(() => {
    const defaultMessages: DisplayMessage[] = [
      {
        id: 'default-1',
        content: 'Welcome to the Grand Finals everyone! Make some noise in chat!',
        sender: 'Parardha',
        badge: 'VANGUARD',
        source: 'local',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'default-2',
        content: 'A-site defense is completely locked down this half!',
        sender: 'Aether',
        badge: 'VARSITY',
        source: 'local',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'default-3',
        content: 'THAT FLICK FROM PHANTOM WAS DISGUSTING 🔥🔥🔥',
        sender: 'Krypton',
        badge: 'CONTENDER',
        source: 'local',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'default-4',
        content: 'First time watching collegiate finals, the production quality is insane!',
        sender: 'Rookie_09',
        badge: 'CADET',
        source: 'local',
        timestamp: new Date().toISOString(),
      },
    ];
    
    setMessages(defaultMessages);
    setIsLoading(false);

    // Initialize YouTube chat if API key and video ID are available
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (apiKey && youtubeVideoId) {
      // Enable debug mode if video ID is 'debug' or 'test'
      const isDebugMode = youtubeVideoId === 'debug' || youtubeVideoId === 'test';
      chatService.current = new YouTubeLiveChatService(apiKey, isDebugMode);
      initializeYouTubeChat();
    } else {
      console.warn('YouTube API key or video ID not configured. Showing local messages only.');
    }

    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, [youtubeVideoId]);

  const initializeYouTubeChat = async () => {
    if (!chatService.current || !youtubeVideoId) return;

    try {
      const liveChatId = await chatService.current.getLiveChatId(youtubeVideoId);
      if (liveChatId) {
        setIsYouTubeConnected(true);
        console.log('YouTube chat connected successfully');
        startPolling();
      } else {
        console.error('No live chat found for video:', youtubeVideoId);
      }
    } catch (error) {
      console.error('Failed to initialize YouTube chat:', error);
    }
  };

  const startPolling = async () => {
    if (!chatService.current) return;

    try {
      const result = await chatService.current.getLiveChatMessages(pageTokenRef.current);
      if (result && result.messages.length > 0) {
        const newMessages: DisplayMessage[] = result.messages.map(convertYouTubeMessage);
        
        setMessages(prev => {
          // Add new messages and keep only the last 100 messages
          const updated = [...prev, ...newMessages].slice(-100);
          return updated;
        });
        
        pageTokenRef.current = result.nextPageToken;
      }

      // Schedule next poll
      pollingRef.current = setTimeout(startPolling, result?.pollingIntervalMillis || 5000);
    } catch (error) {
      console.error('YouTube polling error:', error);
      // Retry in 10 seconds on error
      pollingRef.current = setTimeout(startPolling, 10000);
    }
  };

  const convertYouTubeMessage = (ytMessage: YouTubeChatMessage): DisplayMessage => {
    let badge: 'VANGUARD' | 'VARSITY' | 'CONTENDER' | 'CADET' = 'CADET';
    
    if (ytMessage.isChatOwner) {
      badge = 'VANGUARD';
    } else if (ytMessage.isChatModerator) {
      badge = 'VARSITY';
    } else if (ytMessage.isChatSponsor) {
      badge = 'CONTENDER';
    }

    return {
      id: ytMessage.id,
      content: ytMessage.displayMessage,
      sender: ytMessage.authorDisplayName,
      badge,
      source: 'youtube',
      timestamp: ytMessage.publishedAt,
    };
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending local message (no storage, just display)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMsg.trim()) return;

    const newMessage: DisplayMessage = {
      id: Date.now().toString(),
      content: inputMsg.trim(),
      sender: anonymousUsername,
      badge: 'CADET',
      source: 'local',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage].slice(-100));
    setInputMsg('');
  };

  // Get badge class for styling
  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'VANGUARD': return 'badge-vanguard';
      case 'VARSITY': return 'badge-varsity';
      case 'CONTENDER': return 'badge-contender';
      case 'CADET': return 'badge-cadet';
      default: return 'badge-cadet';
    }
  };

  // Get source indicator for message
  const getSourceIndicator = (source: string) => {
    return source === 'youtube' ? '📺' : '💻';
  };

  if (isLoading) {
    return (
      <div className={`live-chat-panel ${className}`}>
        <div className="chat-head">
          <span className="chat-head-title">ARENA LIVE CHAT</span>
          <span className="chat-viewers-count">Loading...</span>
        </div>
        <div className="chat-msgs-body" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--white-muted)'
        }}>
          <span>Loading chat messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`live-chat-panel ${className}`}>
      {/* Chat Header */}
      <div className="chat-head">
        <span className="chat-head-title">
          ARENA LIVE CHAT
          {isYouTubeConnected && (
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '10px', 
              color: '#4ade80',
              fontWeight: 'normal'
            }}>
              • YT CONNECTED
            </span>
          )}
        </span>
        <span className="chat-viewers-count">{onlineCount.toLocaleString()} ONLINE</span>
      </div>

      {/* Messages Body */}
      <div className="chat-msgs-body">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-msg-row">
            <span className={`chat-badge ${getBadgeClass(msg.badge)}`}>
              {msg.badge}
            </span>
            <span className="chat-sender">
              {getSourceIndicator(msg.source)} {msg.sender}:
            </span>
            <span className="chat-content">{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* User Info Bar */}
      <div style={{
        padding: '0.5rem 0.75rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.75rem',
        color: 'var(--white-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        Chatting as: <span style={{ color: '#fff' }}>{anonymousUsername}</span>
        <span className="chat-badge badge-cadet" style={{
          marginLeft: '8px',
          fontSize: '0.6rem',
          padding: '0.05rem 0.3rem'
        }}>
          CADET
        </span>
      </div>

      {/* Chat Input */}
      <form className="chat-input-bar" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder={`Send a message as ${anonymousUsername}...`}
          required
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          maxLength={500}
        />
        <button type="submit" className="chat-send-btn">
          SEND
        </button>
      </form>
    </div>
  );
}