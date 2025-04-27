// import { extractYouTubeVideoId } from "./isYoutubeLink";
// import axios from "axios";
// // import { extractYouTubeVideoId } from './isYoutubeLink';
// import { XMLParser } from "fast-xml-parser";
// import { YoutubeTranscript } from "youtube-transcript";
// import { getYTDataFromAPI } from "./getYTDataFromAPI";

// export const getYTSubtitleFromPage = async (ytlink: string) => {
//   const videoId = extractYouTubeVideoId(ytlink);

//   if (!videoId) {
//     console.error("Video ID not found");
//     return;
//   }

//   try {
//     // Fetch the video page content using axios
//     const response = await axios.get(
//       `https://www.youtube.com/watch?v=${videoId}`
//     );
//     // console.log("81", {response})
//     const text = response.data;

//     // console.log("84", {text})
//     // Parse the player response to extract captions
//     const playerResponsePattern = /ytInitialPlayerResponse\s*=\s*({.*?});/;
//     const match = playerResponsePattern.exec(text);
//     if (!match) {
//       console.error("Player response not found");
//       return;
//     }

//     // console.log("93", {match})
//     const playerResponse = JSON.parse(match[1]);

//     // Extract title and description
//     const videoDetails = playerResponse.videoDetails;
//     const title = videoDetails?.title;
//     const description = videoDetails?.shortDescription;

//     // console.log("102", { videoDetails });

//     if (!videoDetails) {
//       const data: any = await YoutubeTranscript.fetchTranscript(videoId);
//       // console.log(data, "data");
//       const subtitles = data
//         .map((singleSubs: any) => singleSubs.text.trim())
//         .join("\n");

//       const getYTDataFromAPIData: any = await getYTDataFromAPI(videoId);

//       const title = getYTDataFromAPIData.title;
//       const description = getYTDataFromAPIData.description;
//       const lengthSeconds = getYTDataFromAPIData.length.totalSeconds;
//       const channelId = getYTDataFromAPIData.channelId;
//       const keywords = getYTDataFromAPIData.keywords;
//       const author = getYTDataFromAPIData.author;

//       const videoDetailsData = {
//         channelId: channelId,
//         lengthSeconds: lengthSeconds,
//         keywords: keywords,
//         author: author,
//       };

//       const detailData = { subtitles, title, description, videoDetailsData };
//       // console.log(detailData);
//       return detailData;
//     }

//     const captionTracks =
//       playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
//     if (!captionTracks || captionTracks.length === 0) {
//       console.error("No caption tracks found");
//       return;
//     }

//     // Fetch the first caption track using axios
//     const subtitleUrl = captionTracks[0].baseUrl;
//     const subtitlesResponse = await axios.get(subtitleUrl);
//     const subtitlesText = subtitlesResponse.data;

//     // Parse and display subtitles using fast-xml-parser
//     const parser = new XMLParser();
//     const xmlDoc = parser.parse(subtitlesText);

//     // Extract the texts
//     const texts = xmlDoc.transcript.text;
//     // console.log({texts})

//     // Handle different subtitle formats
//     const subtitles = texts
//       .map((textNode: string) => {
//         if (typeof textNode === "string") {
//           return textNode; // For plain text nodes
//         } else if (typeof textNode === "object" && "#text" in textNode) {
//           return textNode["#text"]; // For nodes with nested text content
//         }
//         return "";
//       })
//       .join("\n");

//     const videoDetailsData = {
//       channelId: videoDetails.channelId,
//       lengthSeconds: videoDetails.lengthSeconds,
//       keywords: videoDetails.keywords,
//       author: videoDetails.author,
//     };

//     return { subtitles, title, description, videoDetailsData };
//   } catch (error) {
//     console.error("Error fetching and scraping:", error);
//     return null;
//   }
// };

// // getYTSubtitleFromPage(
// //   "https://www.youtube.com/watch?v=gcOyAwm2zp8&list=RDGMEMCMFH2exzjBeE_zAHHJOdxg"
// // );

// // import axios from 'axios';
// // import { extractYouTubeVideoId } from './isYoutubeLink';
// // import { XMLParser } from 'fast-xml-parser';

// // const userAgents = [
// //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
// //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15",
// //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0",
// //   "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
// //   "Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1",
// //   "Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
// //   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
// //   "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
// //   "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0",
// //   "Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18"
// // ];

// // function getRandomUserAgent() {
// //     return userAgents[Math.floor(Math.random() * userAgents.length)];
// // }

// // function randomDelay(min = 500, max = 1500) {
// //     return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
// // }

// // // Generates a realistic referrer URL based on the YouTube video ID
// // function generateReferrer(videoId: string) {
// //     return `https://www.youtube.com/results?search_query=${videoId}`;
// // }

// // export const getYTSubtitleFromPage = async (ytlink: string) => {
// //     const videoId = extractYouTubeVideoId(ytlink);
// //     if (!videoId) {
// //         console.error('Video ID not found');
// //         return;
// //     }

// //     await randomDelay();

// //     const headers = {
// //         'User-Agent': getRandomUserAgent(),
// //         'Accept-Language': 'en-US,en;q=0.9',
// //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
// //         'Referer': generateReferrer(videoId) // Set the referer header
// //     };

// //     try {
// //         const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, { headers });
// //         const text = response.data;

// //         const playerResponsePattern = /ytInitialPlayerResponse\s*=\s*({.*?});/;
// //         const match = playerResponsePattern.exec(text);
// //         if (!match) {
// //             console.error('Player response not found');
// //             return;
// //         }

// //         const playerResponse = JSON.parse(match[1]);
// //         const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
// //         if (!captionTracks || captionTracks.length === 0) {
// //             console.error('No caption tracks found');
// //             return;
// //         }

// //         const subtitleUrl = captionTracks[0].baseUrl;
// //         await randomDelay();
// //         const subtitlesResponse = await axios.get(subtitleUrl, { headers });
// //         const subtitlesText = subtitlesResponse.data;

// //         const parser = new XMLParser();
// //         const xmlDoc = parser.parse(subtitlesText);
// //         const texts = xmlDoc.transcript.text;

// //         const subtitles = texts.map((textNode:string) => {
// //             return typeof textNode === 'object' && '#text' in textNode ? textNode['#text'] : textNode;
// //         }).join('\n');

// //         return {
// //             subtitles,
// //             title: playerResponse.videoDetails.title,
// //             description: playerResponse.videoDetails.shortDescription,
// //             videoDetailsData: {
// //                 channelId: playerResponse.videoDetails.channelId,
// //                 lengthSeconds: playerResponse.videoDetails.lengthSeconds,
// //                 keywords: playerResponse.videoDetails.keywords,
// //                 author: playerResponse.videoDetails.author,
// //             }
// //         };
// //     } catch ( error ) {
// //         console.error('Error fetching and scraping:', error);
// //         return null;
// //     }
// // };

// getYTSubtitleFromPage("https://www.youtube.com/watch?v=7hr60EumwQ4").then(
//   (data) => {
//     console.log(data);
//   }
// );

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

// Function to extract YouTube video ID from a URL
const extractYouTubeVideoId = (url: any) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYTSubtitleFromPage = async (ytlink: any) => {
  const videoId = extractYouTubeVideoId(ytlink);

  if (!videoId) {
    console.error('Video ID not found');
    return;
  }

  try {
    // Fetch the video page content using axios
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
    const text = response.data;

    // Parse the player response to extract captions
    const playerResponsePattern = /ytInitialPlayerResponse\s*=\s*({.*?});/;
    const match = playerResponsePattern.exec(text);

    if (!match) {
      console.error('Player response not found');
      return;
    }

    const playerResponse = JSON.parse(match[1]);
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || captionTracks.length === 0) {
      console.error('No caption tracks found');
      return;
    }

    // Fetch the first caption track using axios
    const subtitleUrl = captionTracks[0].baseUrl;
    const subtitlesResponse = await axios.get(subtitleUrl);
    const subtitlesText = subtitlesResponse.data;

    // Parse and display subtitles using fast-xml-parser
    const parser = new XMLParser();
    const xmlDoc = parser.parse(subtitlesText);
    const texts = xmlDoc.transcript.text;

    const subtitles = texts
      .map((textNode: any) => {
        return typeof textNode === 'object' && '#text' in textNode ? textNode['#text'] : textNode;
      })
      .join('\n');

    return {
      subtitles,
      title: playerResponse.videoDetails.title,
      description: playerResponse.videoDetails.shortDescription,
      videoDetailsData: {
        channelId: playerResponse.videoDetails.channelId,
        lengthSeconds: playerResponse.videoDetails.lengthSeconds,
        keywords: playerResponse.videoDetails.keywords,
        author: playerResponse.videoDetails.author,
      },
    };
  } catch (error) {
    console.error('Error fetching and scraping:', error);
    return null;
  }
};

// Example usage
getYTSubtitleFromPage('https://www.youtube.com/watch?v=7hr60EumwQ4')
  .then(data => {
    console.log(data);
  })
  .catch(console.error);
