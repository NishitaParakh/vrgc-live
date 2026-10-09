// YouTube Live Chat API Service
export interface YouTubeChatMessage {
  id: string;
  authorDisplayName: string;
  displayMessage: string;
  publishedAt: string;
  authorChannelId: string;
  isChatOwner?: boolean;
  isChatModerator?: boolean;
  isChatSponsor?: boolean;
}

export class YouTubeLiveChatService {
  private apiKey: string;
  private liveChatId: string | null = null;
  private debugMode: boolean = false;

  constructor(apiKey: string, debugMode: boolean = false) {
    this.apiKey = apiKey;
    this.debugMode = debugMode;
  }

  // Get the live chat ID from a YouTube live video
  async getLiveChatId(videoId: string): Promise<string | null> {
    // Debug mode - simulate a live chat ID
    if (this.debugMode) {
      console.log('🔧 DEBUG MODE: Simulating live chat ID');
      this.liveChatId = 'debug-live-chat-id';
      return this.liveChatId;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('YouTube API Response:', data);
      
      if (data.items && data.items.length > 0) {
        const liveChatId = data.items[0].liveStreamingDetails?.activeLiveChatId;
        if (!liveChatId) {
          console.warn('No active live chat found. Video might not be live or chat might be disabled.');
          return null;
        }
        this.liveChatId = liveChatId;
        console.log('✅ Live chat ID found:', liveChatId);
        return liveChatId;
      }
      
      console.warn('No video found with ID:', videoId);
      return null;
    } catch (error) {
      console.error('Error getting live chat ID:', error);
      return null;
    }
  }

  // Fetch live chat messages
  async getLiveChatMessages(pageToken?: string): Promise<{
    messages: YouTubeChatMessage[];
    nextPageToken?: string;
    pollingIntervalMillis: number;
  } | null> {
    if (!this.liveChatId) {
      console.error('No live chat ID available');
      return null;
    }

    // Debug mode - return mock messages
    if (this.debugMode) {
      return this.getMockMessages();
    }

    try {
      let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${this.liveChatId}&part=snippet,authorDetails&key=${this.apiKey}`;
      
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        let parsedError;
        
        try {
          parsedError = JSON.parse(errorText);
        } catch {
          parsedError = { error: { message: errorText } };
        }
        
        // Handle rate limiting specifically
        if (response.status === 403) {
          const errorMessage = parsedError.error?.message || errorText;
          if (errorMessage.includes('rateLimitExceeded') || errorMessage.includes('too soon')) {
            throw new Error(`Rate limit exceeded. YouTube API requests are being sent too frequently. Please wait before the next request.`);
          }
        }
        
        console.error(`YouTube API error: ${response.status} -`, parsedError);
        throw new Error(`YouTube API error: ${response.status} - ${parsedError.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      const messages: YouTubeChatMessage[] = data.items?.map((item: any) => ({
        id: item.id,
        authorDisplayName: item.authorDetails.displayName,
        displayMessage: item.snippet.displayMessage,
        publishedAt: item.snippet.publishedAt,
        authorChannelId: item.authorDetails.channelId,
        isChatOwner: item.authorDetails.isChatOwner,
        isChatModerator: item.authorDetails.isChatModerator,
        isChatSponsor: item.authorDetails.isChatSponsor,
      })) || [];

      // Ensure minimum polling interval of 5 seconds to avoid rate limits
      const pollingInterval = Math.max(data.pollingIntervalMillis || 10000, 5000);

      return {
        messages,
        nextPageToken: data.nextPageToken,
        pollingIntervalMillis: pollingInterval,
      };
    } catch (error) {
      console.error('Error fetching live chat messages:', error);
      throw error; // Re-throw to be handled by the calling code
    }
  }

  // Mock messages for testing
  private getMockMessages(): {
    messages: YouTubeChatMessage[];
    nextPageToken?: string;
    pollingIntervalMillis: number;
  } {
    const mockMessages: YouTubeChatMessage[] = [];
    
    // Randomly generate 0-3 mock messages
    const messageCount = Math.floor(Math.random() * 4);
    const sampleMessages = [
      'This stream is amazing! 🔥',
      'GG to all players',
      'Who else is watching from India?',
      'Can someone explain the strategy here?',
      'The graphics look incredible',
      'VRGC representing! 💪',
      'This tournament is intense',
      'Best clutch ever seen!',
      'When does the next match start?',
      'Love the production quality'
    ];
    
    const sampleUsers = [
      { name: 'GamerPro123', isMod: false, isOwner: false, isSponsor: false },
      { name: 'StreamModerator', isMod: true, isOwner: false, isSponsor: false },
      { name: 'ChannelOwner', isMod: false, isOwner: true, isSponsor: false },
      { name: 'SponsorMember', isMod: false, isOwner: false, isSponsor: true },
      { name: 'CasualViewer', isMod: false, isOwner: false, isSponsor: false },
    ];

    for (let i = 0; i < messageCount; i++) {
      const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      
      mockMessages.push({
        id: `mock-${Date.now()}-${i}`,
        authorDisplayName: randomUser.name,
        displayMessage: randomMessage,
        publishedAt: new Date().toISOString(),
        authorChannelId: `channel-${i}`,
        isChatOwner: randomUser.isOwner,
        isChatModerator: randomUser.isMod,
        isChatSponsor: randomUser.isSponsor,
      });
    }

    console.log(`🔧 DEBUG: Generated ${messageCount} mock messages`);
    return {
      messages: mockMessages,
      pollingIntervalMillis: 8000, // Longer polling for debug mode (8 seconds)
    };
  }

  // Convert YouTube chat message to our unified format
  static convertToUnifiedMessage(ytMessage: YouTubeChatMessage): {
    content: string;
    sender: string;
    sender_type: 'youtube';
    badge?: 'VANGUARD' | 'VARSITY' | 'CONTENDER' | 'CADET';
    created_at: string;
    youtube_author_id: string;
    youtube_message_id: string;
  } {
    // Determine badge based on YouTube privileges
    let badge: 'VANGUARD' | 'VARSITY' | 'CONTENDER' | 'CADET' = 'CADET';
    
    if (ytMessage.isChatOwner) {
      badge = 'VANGUARD';
    } else if (ytMessage.isChatModerator) {
      badge = 'VARSITY';
    } else if (ytMessage.isChatSponsor) {
      badge = 'CONTENDER';
    }

    return {
      content: ytMessage.displayMessage,
      sender: ytMessage.authorDisplayName,
      sender_type: 'youtube',
      badge,
      created_at: ytMessage.publishedAt,
      youtube_author_id: ytMessage.authorChannelId,
      youtube_message_id: ytMessage.id,
    };
  }
}