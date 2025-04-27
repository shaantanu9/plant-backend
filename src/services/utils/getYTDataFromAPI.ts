import * as fs from 'fs'; // Importing fs module
import * as readline from 'readline'; // Importing readline module
import { google } from 'googleapis'; // Importing googleapis
import credJSON from './credentials.json'; // Importing credentials
// import CMDYoutubeSubtitle from "./CMDYoutubeSubtitle";
import { parasite } from './parasite';

// Log the credentials to verify they are loaded correctly
console.log(credJSON, 'credJSON');

// Define the scopes for the YouTube API
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  // "https://www.googleapis.com/auth/youtube",
  'https://www.googleapis.com/auth/youtubepartner',
];
const TOKEN_PATH = './token.json';

// Function to load client secrets and authorize the client
function loadClientSecretsAndAuthorize(videoId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // Directly use the imported credentials
      const credentials = credJSON;
      authorize(credentials, videoId, getVideoDetails).then(resolve).catch(reject);
    } catch (err) {
      console.error('Error parsing client secret file:', err);
      reject(err);
    }
  });
}

// Function to create an OAuth2 client and execute the callback function
function authorize(credentials: any, videoId: string, callback: any): Promise<any> {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err: NodeJS.ErrnoException | null, token: Buffer) => {
      if (err) {
        getAccessToken(oAuth2Client, videoId, callback).then(resolve).catch(reject);
      } else {
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
        callback(oAuth2Client, videoId).then(resolve).catch(reject);
      }
    });
  });
}

// Function to get and store a new token after user authorization
function getAccessToken(oAuth2Client: any, videoId: string, callback: any): Promise<any> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code: string) => {
      rl.close();
      oAuth2Client.getToken(code, (err: Error | null, token: any) => {
        if (err) {
          console.error('Error retrieving access token', err);
          return reject(err);
        }
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: NodeJS.ErrnoException | null) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client, videoId).then(resolve).catch(reject);
      });
    });
  });
}

// Function to fetch and return details of a video by ID
function getVideoDetails(auth: any, videoId: string): Promise<any> {
  const service = google.youtube('v3');
  return new Promise((resolve, reject) => {
    service.videos.list(
      {
        auth: auth,
        part: ['snippet', 'contentDetails', 'statistics'], // Use an array for part
        id: [videoId], // Use an array for id
      },
      async (err: any, res: any) => {
        if (err) return reject('The API returned an error: ' + err);
        const video = res.data.items[0];

        const videoDetails = {
          title: video.snippet.title,
          description: video.snippet.description,
          length: parseISODuration(video.contentDetails.duration),
          views: video.statistics.viewCount,
          channelId: video.snippet.channelId,
          keywords: video.snippet.tags || [], // Ensure keywords is an array
          author: video.snippet.channelTitle,
        };

        try {
          // const captions = await getVideoCaptions(auth, videoId);
          resolve({ ...videoDetails });
        } catch (error) {
          reject('Error fetching captions: ' + error);
        }
      },
    );
  });
}

// Function to parse the ISO 8601 duration format
function parseISODuration(duration: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const days = parseInt(matches[1] || '0', 10);
  const hours = parseInt(matches[2] || '0', 10);
  const minutes = parseInt(matches[3] || '0', 10);
  const seconds = parseInt(matches[4] || '0', 10);

  const totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
}

// Call the function to start the process, passing the video ID as an argument
export async function getYTDataFromAPI(videoId: string): Promise<{
  title: string;
  description: string;
  length: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  views: string;
  channelId: string;
  keywords: string[];
  content: string;
}> {
  try {
    const [data, content]: any = await Promise.all([
      loadClientSecretsAndAuthorize(videoId),
      parasite(videoId), // Uncomment if you have this function
      // CMDYoutubeSubtitle(videoId), // Uncomment if you have this function
    ]);
    data.subtitle = content; // Placeholder for content, replace as needed
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Uncomment to test the function
// getYTDataFromAPI("gFQV08PXmnE").then(console.log).catch(console.error);
