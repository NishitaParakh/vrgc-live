// Quick YouTube API Test
// Open browser console and run this to test your video ID and API key

async function testYouTubeAPI() {
  const API_KEY = "YOUR_API_KEY_HERE";  // Replace with your actual API key
  const VIDEO_ID = "YOUR_VIDEO_ID_HERE"; // Replace with your actual video ID
  
  console.log("🧪 Testing YouTube API...");
  console.log("API Key:", API_KEY.substring(0, 10) + "...");
  console.log("Video ID:", VIDEO_ID);
  
  try {
    // Test 1: Check if video exists and is live
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${VIDEO_ID}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("📊 API Response:", data);
    
    if (!data.items || data.items.length === 0) {
      console.error("❌ No video found with this ID");
      return;
    }
    
    const video = data.items[0];
    console.log("📹 Video Title:", video.snippet.title);
    console.log("📅 Published:", video.snippet.publishedAt);
    
    if (!video.liveStreamingDetails) {
      console.error("❌ This video is not a live stream");
      return;
    }
    
    const liveDetails = video.liveStreamingDetails;
    console.log("🔴 Live Details:", liveDetails);
    
    if (!liveDetails.activeLiveChatId) {
      console.error("❌ No active live chat (stream might be offline or chat disabled)");
      return;
    }
    
    console.log("✅ Live Chat ID found:", liveDetails.activeLiveChatId);
    console.log("✅ This video should work with your chat integration!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    
    if (error.message.includes('403')) {
      console.error("🔑 API Key issue - check if YouTube Data API v3 is enabled");
    }
    if (error.message.includes('400')) {
      console.error("📹 Video ID might be invalid");
    }
  }
}

// Run the test
testYouTubeAPI();