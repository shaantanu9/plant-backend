// import axios from 'axios';
// import { google } from 'googleapis';
// import fs from 'fs';
// import path from 'path';

// const API_KEY = 'YOUR_YOUTUBE_API_KEY';
// const CHANNEL_ID = 'YOUR_CHANNEL_ID';
// const LAST_CHECKED_FILE = path.join(__dirname, 'lastChecked.json');

// const youtube = google.youtube({
//   version: 'v3',
//   auth: API_KEY,
// });

// // Function to get the last checked video ID
// const getLastCheckedVideoId = (): string | null => {
//   if (fs.existsSync(LAST_CHECKED_FILE)) {
//     const data = fs.readFileSync(LAST_CHECKED_FILE, 'utf8');
//     const json = JSON.parse(data);
//     return json.lastVideoId || null;
//   }
//   return null;
// };

// // Function to save the latest checked video ID
// const saveLastCheckedVideoId = (videoId: string) => {
//   fs.writeFileSync(
//     LAST_CHECKED_FILE,
//     JSON.stringify({ lastVideoId: videoId }, null, 2),
//     'utf8'
//   );
// };

// // Function to check for new videos
// const checkForNewVideos = async () => {
//   try {
//     const response = await youtube.search.list({
//       part: 'snippet',
//       channelId: CHANNEL_ID,
//       order: 'date',
//       maxResults: 5,
//       key: API_KEY,
//     });

//     const videos = response.data.items || [];
//     const lastCheckedVideoId = getLastCheckedVideoId();

//     if (videos.length === 0) {
//       console.log('No new videos found.');
//       return;
//     }

//     for (const video of videos) {
//       const videoId = video.id?.videoId;
//       if (videoId && videoId !== lastCheckedVideoId) {
//         console.log(`New video found: ${video.snippet.title}`);
//         // Save the latest video ID
//         saveLastCheckedVideoId(videoId);
//         break;
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching videos:', error);
//   }
// };

// // Run the check every hour (3600000 milliseconds)
// setInterval(checkForNewVideos, 3600000);

// // Run an initial check
// checkForNewVideos();
