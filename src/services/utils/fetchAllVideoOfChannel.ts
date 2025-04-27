// import { google } from 'googleapis';
// import fs from 'fs';
// import path from 'path';

// const API_KEY = 'YOUR_YOUTUBE_API_KEY';
// const CHANNEL_ID = 'YOUR_CHANNEL_ID';
// const OUTPUT_FILE = path.join(__dirname, 'videos.json');

// const youtube = google.youtube({
//   version: 'v3',
//   auth: API_KEY,
// });

// // Function to fetch all video IDs from a channel
// const fetchAllVideos = async (channelId: string) => {
//   try {
//     let videos: any[] = [];
//     let nextPageToken: string | undefined = undefined;

//     do {
//       const response:any = await youtube.playlistItems.list({
//         part: 'snippet',
//         playlistId: (await getUploadsPlaylistId(channelId)),
//         maxResults: 50,
//         pageToken: nextPageToken,
//       });

//       const items = response.data.items || [];
//       videos = videos.concat(items.map(item => ({
//         id: item.snippet?.resourceId?.videoId,
//         title: item.snippet?.title,
//         publishedAt: item.snippet?.publishedAt,
//       })));

//       nextPageToken = response.data.nextPageToken;
//     } while (nextPageToken);

//     return videos;
//   } catch (error) {
//     console.error('Error fetching videos:', error);
//     return [];
//   }
// };

// // Function to get the playlist ID for uploaded videos
// const getUploadsPlaylistId = async (channelId: string) => {
//   try {
//     const response:any = await youtube.channels.list({
//       part: 'contentDetails',
//       id: channelId,
//     });

//     const playlistId = response.?data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
//     if (!playlistId) {
//       throw new Error('Uploads playlist ID not found');
//     }

//     return playlistId;
//   } catch (error) {
//     console.error('Error fetching playlist ID:', error);
//     throw error;
//   }
// };

// // Fetch and save all videos
// const fetchAndSaveVideos = async () => {
//   try {
//     const videos = await fetchAllVideos(CHANNEL_ID);
//     fs.writeFileSync(OUTPUT_FILE, JSON.stringify(videos, null, 2), 'utf8');
//     console.log(`Videos saved to ${OUTPUT_FILE}`);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

// // Run the script
// fetchAndSaveVideos();
