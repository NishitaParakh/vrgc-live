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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const pageTokenRef = useRef<string | undefined>(undefined);

  // Initialize with empty messages array
  useEffect(() => {
    console.log('🚀 Initializing chat with empty messages');
    setMessages([]); // Start with empty chat
    setIsLoading(false);

    // Initialize YouTube chat if API key and video ID are available
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (apiKey && youtubeVideoId) {
      // Only use debug mode if explicitly set to 'debug' and no real video ID
      const isDebugMode = youtubeVideoId === 'debug' && !youtubeVideoId.match(/^[a-zA-Z0-9_-]{11}$/);
      console.log('🔧 Debug mode:', isDebugMode, 'for video ID:', youtubeVideoId);
      chatService.current = new YouTubeLiveChatService(apiKey, isDebugMode);
      initializeYouTubeChat();
    } else {
      console.warn('YouTube API key or video ID not configured. Chat will only show user messages.');
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
        
        console.log('📥 New messages received:', newMessages.map(m => `${m.sender}: ${m.content}`));
        
        setMessages(prev => {
          // Add new messages and keep only the last 100 messages
          const updated = [...prev, ...newMessages].slice(-100);
          return updated;
        });
        
        pageTokenRef.current = result.nextPageToken;
      }

      // Use YouTube's recommended polling interval (usually 5-10 seconds)
      const pollingInterval = result?.pollingIntervalMillis || 10000; // Default to 10 seconds to avoid rate limits
      pollingRef.current = setTimeout(startPolling, pollingInterval);
      
    } catch (error) {
      console.error('YouTube polling error:', error);
      
      // If rate limited, wait longer before retrying
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isRateLimit = errorMessage.includes('403') || errorMessage.includes('rateLimitExceeded');
      const retryDelay = isRateLimit ? 30000 : 15000; // 30s for rate limit, 15s for other errors
      
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      pollingRef.current = setTimeout(startPolling, retryDelay);
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

  // Auto-scroll to bottom when new messages arrive (only within chat container)
  useEffect(() => {
    // Use the ref for reliable container-only scrolling
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, [messages]);

  // Handle sending local message (no storage, just display)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
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

  // Handle Enter key press specifically
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default Enter behavior
      e.stopPropagation(); // Stop event from bubbling up
      
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
      
      // Keep focus on input after sending message
      const target = e.target as HTMLInputElement;
      target.blur();
      setTimeout(() => target.focus(), 0);
    }
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
      <div className="chat-msgs-body" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--white-muted)', 
            fontStyle: 'italic',
            padding: '2rem 0'
          }}>
            Chat will appear here when available...
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="chat-msg-row">
              {/* Only show badge if it's not CADET */}
              {msg.badge !== 'CADET' && (
                <span className={`chat-badge ${getBadgeClass(msg.badge)}`}>
                  {msg.badge}
                </span>
              )}
              <span className="chat-sender">
                {msg.sender}:
              </span>
              <span className="chat-content">{msg.content}</span>
            </div>
          ))
        )}
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
      </div>

      {/* Chat Input */}
      <form className="chat-input-bar" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder={`Send a message as ${anonymousUsername}...`}
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          autoComplete="off"
        />
        <button type="submit" className="chat-send-btn">
          SEND
        </button>
      </form>
    </div>
  );
}