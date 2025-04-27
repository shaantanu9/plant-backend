// // // // // // // // // // import * as fs from "fs"; // Importing fs module
// // // // // // // // // // import * as readline from "readline"; // Importing readline module
// // // // // // // // // // import { google } from "googleapis"; // Importing googleapis
// // // // // // // // // // import credJSON from './credentials.json'; // Importing credentials

// // // // // // // // // // // Log the credentials to verify they are loaded correctly
// // // // // // // // // // console.log(credJSON, 'credJSON');

// // // // // // // // // // // Define the scopes for the YouTube API
// // // // // // // // // // const SCOPES = [
// // // // // // // // // //   "https://www.googleapis.com/auth/youtube.force-ssl",
// // // // // // // // // //   "https://www.googleapis.com/auth/youtube.readonly",
// // // // // // // // // //   "https://www.googleapis.com/auth/youtubepartner",
// // // // // // // // // // ];
// // // // // // // // // // const TOKEN_PATH = "./token.json";

// // // // // // // // // // // Function to load client secrets and authorize the client
// // // // // // // // // // function loadClientSecretsAndAuthorize(videoId: string): Promise<any> {
// // // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const credentials = credJSON;
// // // // // // // // // //       authorize(credentials, videoId, getVideoDetails)
// // // // // // // // // //         .then(resolve)
// // // // // // // // // //         .catch(reject);
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Error parsing client secret file:", err);
// // // // // // // // // //       reject(err);
// // // // // // // // // //     }
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // Function to create an OAuth2 client and execute the callback function
// // // // // // // // // // function authorize(credentials: any, videoId: string, callback: any): Promise<any> {
// // // // // // // // // //   const { client_secret, client_id, redirect_uris } = credentials.web;
// // // // // // // // // //   const oAuth2Client = new google.auth.OAuth2(
// // // // // // // // // //     client_id,
// // // // // // // // // //     client_secret,
// // // // // // // // // //     redirect_uris[0]
// // // // // // // // // //   );

// // // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // // //     fs.readFile(TOKEN_PATH, (err: NodeJS.ErrnoException | null, token: Buffer) => {
// // // // // // // // // //       if (err) {
// // // // // // // // // //         getAccessToken(oAuth2Client, videoId, callback)
// // // // // // // // // //           .then(resolve)
// // // // // // // // // //           .catch(reject);
// // // // // // // // // //       } else {
// // // // // // // // // //         oAuth2Client.setCredentials(JSON.parse(token.toString()));
// // // // // // // // // //         callback(oAuth2Client, videoId).then(resolve).catch(reject);
// // // // // // // // // //       }
// // // // // // // // // //     });
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // Function to get and store a new token after user authorization
// // // // // // // // // // function getAccessToken(oAuth2Client: any, videoId: string, callback: any): Promise<any> {
// // // // // // // // // //   const authUrl = oAuth2Client.generateAuthUrl({
// // // // // // // // // //     access_type: "offline",
// // // // // // // // // //     scope: SCOPES,
// // // // // // // // // //   });
// // // // // // // // // //   console.log("Authorize this app by visiting this url:", authUrl);
// // // // // // // // // //   const rl = readline.createInterface({
// // // // // // // // // //     input: process.stdin,
// // // // // // // // // //     output: process.stdout,
// // // // // // // // // //   });
// // // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // // //     rl.question("Enter the code from that page here: ", (code: string) => {
// // // // // // // // // //       rl.close();
// // // // // // // // // //       oAuth2Client.getToken(code, (err: Error | null, token: any) => {
// // // // // // // // // //         if (err) {
// // // // // // // // // //           console.error("Error retrieving access token", err);
// // // // // // // // // //           return reject(err);
// // // // // // // // // //         }
// // // // // // // // // //         oAuth2Client.setCredentials(token);
// // // // // // // // // //         fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: NodeJS.ErrnoException | null) => {
// // // // // // // // // //           if (err) return console.error(err);
// // // // // // // // // //           console.log("Token stored to", TOKEN_PATH);
// // // // // // // // // //         });
// // // // // // // // // //         callback(oAuth2Client, videoId).then(resolve).catch(reject);
// // // // // // // // // //       });
// // // // // // // // // //     });
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // Function to fetch and return details of a video by ID
// // // // // // // // // // function getVideoDetails(auth: any, videoId: string): Promise<any> {
// // // // // // // // // //   const service = google.youtube("v3");
// // // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // // //     service.videos.list(
// // // // // // // // // //       {
// // // // // // // // // //         auth: auth,
// // // // // // // // // //         part: ["snippet", "contentDetails", "statistics"],
// // // // // // // // // //         id: [videoId],
// // // // // // // // // //       },
// // // // // // // // // //       async (err: any, res: any) => {
// // // // // // // // // //         if (err) return reject("The API returned an error: " + err);
// // // // // // // // // //         const video = res.data.items[0];

// // // // // // // // // //         const videoDetails = {
// // // // // // // // // //           title: video.snippet.title,
// // // // // // // // // //           description: video.snippet.description,
// // // // // // // // // //           length: parseISODuration(video.contentDetails.duration),
// // // // // // // // // //           views: video.statistics.viewCount,
// // // // // // // // // //           channelId: video.snippet.channelId,
// // // // // // // // // //           keywords: video.snippet.tags || [],
// // // // // // // // // //           author: video.snippet.channelTitle,
// // // // // // // // // //         };

// // // // // // // // // //         try {
// // // // // // // // // //           const captions = await getVideoCaptions(auth, videoId); // Fetch captions
// // // // // // // // // //           resolve({ ...videoDetails, captions }); // Include captions in the response
// // // // // // // // // //         } catch (error) {
// // // // // // // // // //           reject("Error fetching captions: " + error);
// // // // // // // // // //         }
// // // // // // // // // //       }
// // // // // // // // // //     );
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // Function to fetch captions for a specific video
// // // // // // // // // // async function getVideoCaptions(auth: any, videoId: string): Promise<any> {
// // // // // // // // // //   const service = google.youtube("v3");
// // // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // // //     service.captions.list(
// // // // // // // // // //       {
// // // // // // // // // //         auth: auth,
// // // // // // // // // //         part: ["snippet"], // Wrap "snippet" in an array
// // // // // // // // // //         videoId: videoId,
// // // // // // // // // //       },
// // // // // // // // // //       (err: any, res: any) => {
// // // // // // // // // //         if (err) return reject("The API returned an error: " + err);
// // // // // // // // // //         const captions = res.data.items;
// // // // // // // // // //         console.log(captions, 'captions 1111');
// // // // // // // // // //         resolve(captions);
// // // // // // // // // //       }
// // // // // // // // // //     );
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // Function to parse the ISO 8601 duration format
// // // // // // // // // // function parseISODuration(duration: string): { days: number; hours: number; minutes: number; seconds: number; totalSeconds: number } {
// // // // // // // // // //   const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
// // // // // // // // // //   const matches = duration.match(regex);

// // // // // // // // // //   if (!matches) {
// // // // // // // // // //     throw new Error("Invalid ISO 8601 duration format");
// // // // // // // // // //   }

// // // // // // // // // //   const days = parseInt(matches[1] || "0", 10);
// // // // // // // // // //   const hours = parseInt(matches[2] || "0", 10);
// // // // // // // // // //   const minutes = parseInt(matches[3] || "0", 10);
// // // // // // // // // //   const seconds = parseInt(matches[4] || "0", 10);

// // // // // // // // // //   const totalSeconds =
// // // // // // // // // //     days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

// // // // // // // // // //   return {
// // // // // // // // // //     days,
// // // // // // // // // //     hours,
// // // // // // // // // //     minutes,
// // // // // // // // // //     seconds,
// // // // // // // // // //     totalSeconds,
// // // // // // // // // //   };
// // // // // // // // // // }

// // // // // // // // // // // Call the function to start the process, passing the video ID as an argument
// // // // // // // // // // export async function getYTDataFromAPI(videoId: string): Promise<{
// // // // // // // // // //   title: string;
// // // // // // // // // //   description: string;
// // // // // // // // // //   length: {
// // // // // // // // // //     days: number;
// // // // // // // // // //     hours: number;
// // // // // // // // // //     minutes: number;
// // // // // // // // // //     seconds: number;
// // // // // // // // // //     totalSeconds: number;
// // // // // // // // // //   };
// // // // // // // // // //   views: string;
// // // // // // // // // //   channelId: string;
// // // // // // // // // //   keywords: string[];
// // // // // // // // // //   captions: any; // Include captions in the return type
// // // // // // // // // // }> {
// // // // // // // // // //   try {
// // // // // // // // // //     const data = await loadClientSecretsAndAuthorize(videoId);
// // // // // // // // // //     return data;
// // // // // // // // // //   } catch (error) {
// // // // // // // // // //     console.error("Error:", error);
// // // // // // // // // //     throw error;
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // // Uncomment to test the function
// // // // // // // // // // getYTDataFromAPI("gFQV08PXmnE").then(console.log).catch(console.error);
// // // // // // // // // import * as fs from "fs"; // Importing fs module
// // // // // // // // // import * as readline from "readline"; // Importing readline module
// // // // // // // // // import { google } from "googleapis"; // Importing googleapis
// // // // // // // // // import credJSON from './credentials.json'; // Importing credentials

// // // // // // // // // // Log the credentials to verify they are loaded correctly
// // // // // // // // // console.log(credJSON, 'credJSON');

// // // // // // // // // // Define the scopes for the YouTube API
// // // // // // // // // const SCOPES = [
// // // // // // // // //   "https://www.googleapis.com/auth/youtube.force-ssl",
// // // // // // // // //   "https://www.googleapis.com/auth/youtube.readonly",
// // // // // // // // //   "https://www.googleapis.com/auth/youtubepartner",
// // // // // // // // // ];
// // // // // // // // // const TOKEN_PATH = "./token.json";

// // // // // // // // // // Function to load client secrets and authorize the client
// // // // // // // // // function loadClientSecretsAndAuthorize(videoId: string): Promise<any> {
// // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // //     try {
// // // // // // // // //       const credentials = credJSON;
// // // // // // // // //       authorize(credentials, videoId, getVideoDetails)
// // // // // // // // //         .then(resolve)
// // // // // // // // //         .catch(reject);
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Error parsing client secret file:", err);
// // // // // // // // //       reject(err);
// // // // // // // // //     }
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // Function to create an OAuth2 client and execute the callback function
// // // // // // // // // function authorize(credentials: any, videoId: string, callback: any): Promise<any> {
// // // // // // // // //   const { client_secret, client_id, redirect_uris } = credentials.web;
// // // // // // // // //   const oAuth2Client = new google.auth.OAuth2(
// // // // // // // // //     client_id,
// // // // // // // // //     client_secret,
// // // // // // // // //     redirect_uris[0]
// // // // // // // // //   );

// // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // //     fs.readFile(TOKEN_PATH, (err: NodeJS.ErrnoException | null, token: Buffer) => {
// // // // // // // // //       if (err) {
// // // // // // // // //         getAccessToken(oAuth2Client, videoId, callback)
// // // // // // // // //           .then(resolve)
// // // // // // // // //           .catch(reject);
// // // // // // // // //       } else {
// // // // // // // // //         oAuth2Client.setCredentials(JSON.parse(token.toString()));
// // // // // // // // //         callback(oAuth2Client, videoId).then(resolve).catch(reject);
// // // // // // // // //       }
// // // // // // // // //     });
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // Function to get and store a new token after user authorization
// // // // // // // // // function getAccessToken(oAuth2Client: any, videoId: string, callback: any): Promise<any> {
// // // // // // // // //   const authUrl = oAuth2Client.generateAuthUrl({
// // // // // // // // //     access_type: "offline",
// // // // // // // // //     scope: SCOPES,
// // // // // // // // //   });
// // // // // // // // //   console.log("Authorize this app by visiting this url:", authUrl);
// // // // // // // // //   const rl = readline.createInterface({
// // // // // // // // //     input: process.stdin,
// // // // // // // // //     output: process.stdout,
// // // // // // // // //   });
// // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // //     rl.question("Enter the code from that page here: ", (code: string) => {
// // // // // // // // //       rl.close();
// // // // // // // // //       oAuth2Client.getToken(code, (err: Error | null, token: any) => {
// // // // // // // // //         if (err) {
// // // // // // // // //           console.error("Error retrieving access token", err);
// // // // // // // // //           return reject(err);
// // // // // // // // //         }
// // // // // // // // //         oAuth2Client.setCredentials(token);
// // // // // // // // //         fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: NodeJS.ErrnoException | null) => {
// // // // // // // // //           if (err) return console.error(err);
// // // // // // // // //           console.log("Token stored to", TOKEN_PATH);
// // // // // // // // //         });
// // // // // // // // //         callback(oAuth2Client, videoId).then(resolve).catch(reject);
// // // // // // // // //       });
// // // // // // // // //     });
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // Function to fetch and return details of a video by ID
// // // // // // // // // function getVideoDetails(auth: any, videoId: string): Promise<any> {
// // // // // // // // //   const service = google.youtube("v3");
// // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // //     service.videos.list(
// // // // // // // // //       {
// // // // // // // // //         auth: auth,
// // // // // // // // //         part: ["snippet", "contentDetails", "statistics"],
// // // // // // // // //         id: [videoId],
// // // // // // // // //       },
// // // // // // // // //       async (err: any, res: any) => {
// // // // // // // // //         if (err) return reject("The API returned an error: " + err);
// // // // // // // // //         const video = res.data.items[0];

// // // // // // // // //         const videoDetails = {
// // // // // // // // //           title: video.snippet.title,
// // // // // // // // //           description: video.snippet.description,
// // // // // // // // //           length: parseISODuration(video.contentDetails.duration),
// // // // // // // // //           views: video.statistics.viewCount,
// // // // // // // // //           channelId: video.snippet.channelId,
// // // // // // // // //           keywords: video.snippet.tags || [],
// // // // // // // // //           author: video.snippet.channelTitle,
// // // // // // // // //         };

// // // // // // // // //         try {
// // // // // // // // //           const captions = await getVideoCaptions(auth, videoId); // Fetch captions
// // // // // // // // //           const subtitleContent = await Promise.all(captions.map(async (caption: any) => {
// // // // // // // // //             const content = await getSubtitleContent(auth, caption.id);
// // // // // // // // //             return { ...caption, content };
// // // // // // // // //           }));
// // // // // // // // //           resolve({ ...videoDetails, subtitleContent }); // Include subtitle content in the response
// // // // // // // // //         } catch (error) {
// // // // // // // // //           reject("Error fetching captions: " + error);
// // // // // // // // //         }
// // // // // // // // //       }
// // // // // // // // //     );
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // Function to fetch captions for a specific video
// // // // // // // // // async function getVideoCaptions(auth: any, videoId: string): Promise<any> {
// // // // // // // // //   const service = google.youtube("v3");
// // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // //     service.captions.list(
// // // // // // // // //       {
// // // // // // // // //         auth: auth,
// // // // // // // // //         part: ["snippet"],
// // // // // // // // //         videoId: videoId,
// // // // // // // // //       },
// // // // // // // // //       (err: any, res: any) => {
// // // // // // // // //         if (err) return reject("The API returned an error: " + err);
// // // // // // // // //         const captions = res.data.items;
// // // // // // // // //         resolve(captions);
// // // // // // // // //       }
// // // // // // // // //     );
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // Function to fetch the subtitle content for a specific caption ID
// // // // // // // // // async function getSubtitleContent(auth: any, captionId: string): Promise<string> {
// // // // // // // // //   const service = google.youtube("v3");
// // // // // // // // //   return new Promise((resolve, reject) => {
// // // // // // // // //     service.captions.download(
// // // // // // // // //       {
// // // // // // // // //         auth: auth,
// // // // // // // // //         id: captionId,
// // // // // // // // //         tfmt: 'srt', // Specify the desired format (e.g., 'srt' for SubRip Subtitle)
// // // // // // // // //       },
// // // // // // // // //       (err: any, res: any) => {
// // // // // // // // //         if (err) return reject("The API returned an error: " + err);
// // // // // // // // //         resolve(res.data);
// // // // // // // // //       }
// // // // // // // // //     );
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // Function to parse the ISO 8601 duration format
// // // // // // // // // function parseISODuration(duration: string): { days: number; hours: number; minutes: number; seconds: number; totalSeconds: number } {
// // // // // // // // //   const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
// // // // // // // // //   const matches = duration.match(regex);

// // // // // // // // //   if (!matches) {
// // // // // // // // //     throw new Error("Invalid ISO 8601 duration format");
// // // // // // // // //   }

// // // // // // // // //   const days = parseInt(matches[1] || "0", 10);
// // // // // // // // //   const hours = parseInt(matches[2] || "0", 10);
// // // // // // // // //   const minutes = parseInt(matches[3] || "0", 10);
// // // // // // // // //   const seconds = parseInt(matches[4] || "0", 10);

// // // // // // // // //   const totalSeconds =
// // // // // // // // //     days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

// // // // // // // // //   return {
// // // // // // // // //     days,
// // // // // // // // //     hours,
// // // // // // // // //     minutes,
// // // // // // // // //     seconds,
// // // // // // // // //     totalSeconds,
// // // // // // // // //   };
// // // // // // // // // }

// // // // // // // // // // Call the function to start the process, passing the video ID as an argument
// // // // // // // // // export async function getYTDataFromAPI(videoId: string): Promise<{
// // // // // // // // //   title: string;
// // // // // // // // //   description: string;
// // // // // // // // //   length: {
// // // // // // // // //     days: number;
// // // // // // // // //     hours: number;
// // // // // // // // //     minutes: number;
// // // // // // // // //     seconds: number;
// // // // // // // // //     totalSeconds: number;
// // // // // // // // //   };
// // // // // // // // //   views: string;
// // // // // // // // //   channelId: string;
// // // // // // // // //   keywords: string[];
// // // // // // // // //   subtitleContent: any; // Include subtitle content in the return type
// // // // // // // // // }> {
// // // // // // // // //   try {
// // // // // // // // //     const data = await loadClientSecretsAndAuthorize(videoId);
// // // // // // // // //     return data;
// // // // // // // // //   } catch (error) {
// // // // // // // // //     console.error("Error:", error);
// // // // // // // // //     throw error;
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // // Uncomment to test the function
// // // // // // // // // getYTDataFromAPI("gFQV08PXmnE").then(console.log).catch(console.error);

// // // // // // // // async function getAutoGeneratedCaptions(videoId: string, apiKey: string) {
// // // // // // // //   const captionsResponse = await fetch(
// // // // // // // //     `https://youtube.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
// // // // // // // //   );
// // // // // // // //   const captionsData = await captionsResponse.json();

// // // // // // // //   const autoGeneratedCaptions = captionsData.items.filter(
// // // // // // // //     (caption: any) => caption.snippet.trackKind === "asr"
// // // // // // // //   );

// // // // // // // //   const captionContents = await Promise.all(
// // // // // // // //     autoGeneratedCaptions.map(async (caption: any) => {
// // // // // // // //       const captionResponse = await fetch(
// // // // // // // //         `https://youtube.googleapis.com/youtube/v3/captions/${caption.id}?tfmt=srt&key=${apiKey}`
// // // // // // // //       );
// // // // // // // //       return await captionResponse.text();
// // // // // // // //     })
// // // // // // // //   );

// // // // // // // //   return captionContents;
// // // // // // // // }

// // // // // // // // const API_KEY = "AIzaSyBR0BnoWKko4hBKqObtJsvtFx22dcdOx3w";
// // // // // // // // getAutoGeneratedCaptions("gFQV08PXmnE", API_KEY)
// // // // // // // //   .then(console.log)
// // // // // // // //   .catch(console.error);

// // // // // // // // // import * as fs from "fs";
// // // // // // // // // import * as readline from "readline";
// // // // // // // // // import { google } from "googleapis";
// // // // // // // // // import CREDENTIALS from "./credentials.json";
// // // // // // // // // import TOKEN from "./token.json";
// // // // // // // // // // Load client secrets from a local file.
// // // // // // // // // // const CREDENTIALS_PATH = "./credentials.json"; // Path to your credentials.json
// // // // // // // // // // const TOKEN_PATH = "./token.json"; // Path to store the access token
// // // // // // // // // const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];

// // // // // // // // // // Load client secrets and authorize the client
// // // // // // // // // async function authorize() {
// // // // // // // // //   //   const content: any = fs.readFileSync(CREDENTIALS_PATH);
// // // // // // // // //   const credentials = CREDENTIALS;

// // // // // // // // //   const { client_secret, client_id, redirect_uris } = credentials.web;
// // // // // // // // //   const oAuth2Client = new google.auth.OAuth2(
// // // // // // // // //     client_id,
// // // // // // // // //     client_secret,
// // // // // // // // //     redirect_uris[0]
// // // // // // // // //   );

// // // // // // // // //   // Check if we have previously stored a token.
// // // // // // // // //   if (TOKEN) {
// // // // // // // // //     // const token: any = fs.readFileSync(TOKEN_PATH);
// // // // // // // // //     oAuth2Client.setCredentials(TOKEN);
// // // // // // // // //   } else {
// // // // // // // // //     // Get a new token if we don't have one
// // // // // // // // //     await getAccessToken(oAuth2Client);
// // // // // // // // //   }

// // // // // // // // //   return oAuth2Client;
// // // // // // // // // }

// // // // // // // // // // Get and store a new token after user authorization
// // // // // // // // // async function getAccessToken(oAuth2Client: any) {
// // // // // // // // //   const authUrl = oAuth2Client.generateAuthUrl({
// // // // // // // // //     access_type: "offline",
// // // // // // // // //     scope: SCOPES,
// // // // // // // // //   });
// // // // // // // // //   console.log("Authorize this app by visiting this url:", authUrl);
// // // // // // // // //   const rl = readline.createInterface({
// // // // // // // // //     input: process.stdin,
// // // // // // // // //     output: process.stdout,
// // // // // // // // //   });
// // // // // // // // //   rl.question("Enter the code from that page here: ", async (code) => {
// // // // // // // // //     rl.close();
// // // // // // // // //     const { tokens } = await oAuth2Client.getToken(code);
// // // // // // // // //     oAuth2Client.setCredentials(tokens);

// // // // // // // // //     fs.writeFileSync('./token.json', JSON.stringify(tokens));
// // // // // // // // //     // console.log("Token stored to", TOKEN_PATH);
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // Get auto-generated captions for a specific video
// // // // // // // // // async function getAutoGeneratedCaptions(auth: any, videoId: any) {
// // // // // // // // //   const youtube = google.youtube({ version: "v3", auth });

// // // // // // // // //   // Retrieve the list of captions
// // // // // // // // //   const captionsResponse = await youtube.captions.list({
// // // // // // // // //     part: ["snippet"],
// // // // // // // // //     videoId: videoId,
// // // // // // // // //   });

// // // // // // // // //   const captionsData = captionsResponse.data;
// // // // // // // // //   if (captionsData && captionsData.items) {
// // // // // // // // //     const autoGeneratedCaptions = captionsData.items.filter(
// // // // // // // // //       (caption: any) => caption.snippet.trackKind === "asr"
// // // // // // // // //     );

// // // // // // // // //     // Fetch the content of each auto-generated caption
// // // // // // // // //     const captionContents = await Promise.all(
// // // // // // // // //       autoGeneratedCaptions.map(async (caption: any) => {
// // // // // // // // //         const captionResponse = await youtube.captions.download({
// // // // // // // // //           id: caption.id,
// // // // // // // // //           tfmt: "srt", // Specify the format you want (e.g., 'srt')
// // // // // // // // //           auth,
// // // // // // // // //         });
// // // // // // // // //         return captionResponse.data; // This will contain the caption text
// // // // // // // // //       })
// // // // // // // // //     );

// // // // // // // // //     return captionContents;
// // // // // // // // //   }

// // // // // // // // //   return "captionContents";
// // // // // // // // // }

// // // // // // // // // // Main function to run the script
// // // // // // // // // async function main(videoId: string) {
// // // // // // // // //   const auth = await authorize();
// // // // // // // // //   const captions = await getAutoGeneratedCaptions(auth, videoId);
// // // // // // // // //   console.log("Auto-generated captions:", captions);
// // // // // // // // // }

// // // // // // // // // // Replace 'YOUR_VIDEO_ID' with the actual video ID
// // // // // // // // // main("gFQV08PXmnE").catch(console.error);

// // // // // // // const puppeteer = require("puppeteer");

// // // // // // // async function getAutoGeneratedCaptions(videoUrl: string) {
// // // // // // //   // Launch a new browser instance
// // // // // // //   const browser = await puppeteer.launch();
// // // // // // //   const page = await browser.newPage();

// // // // // // //   // Go to the YouTube video page
// // // // // // //   await page.goto(videoUrl, { waitUntil: "networkidle2" });

// // // // // // //   // Wait for the captions to load
// // // // // // //   await page.waitForSelector(".ytp-caption-segment");

// // // // // // //   // Extract captions
// // // // // // //   const captions = await page.evaluate(() => {
// // // // // // //     const elements = document.querySelectorAll(".ytp-caption-segment") as any;
// // // // // // //     return Array.from(elements).map((element: any) => element.innerText);
// // // // // // //   });

// // // // // // //   // Close the browser
// // // // // // //   await browser.close();

// // // // // // //   return captions;
// // // // // // // }

// // // // // // // // Replace with the URL of the YouTube video you want to scrape
// // // // // // // const videoUrl = "https://www.youtube.com/watch?v=gFQV08PXmnE";

// // // // // // // getAutoGeneratedCaptions(videoUrl)
// // // // // // //   .then((captions) => {
// // // // // // //     console.log("Auto-generated captions:", captions);
// // // // // // //   })
// // // // // // //   .catch((error) => {
// // // // // // //     console.error("Error fetching captions:", error);
// // // // // // //   });

// // // // // // const puppeteer = require('puppeteer');

// // // // // // async function getAutoGeneratedCaptions(videoUrl:string) {
// // // // // //     // Launch a new browser instance with the no-sandbox option
// // // // // //     const browser = await puppeteer.launch({
// // // // // //         args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these arguments
// // // // // //         headless: true // Set to false if you want to see the browser
// // // // // //     });
// // // // // //     const page = await browser.newPage();

// // // // // //     // Go to the YouTube video page
// // // // // //     await page.goto(videoUrl, { waitUntil: 'networkidle2' });

// // // // // //     // Wait for the captions to load
// // // // // //     await page.waitForSelector('.ytp-caption-segment');

// // // // // //     // Extract captions
// // // // // //     const captions = await page.evaluate(() => {
// // // // // //         const elements:any = document.querySelectorAll('.ytp-caption-segment') as any
// // // // // //         return Array.from(elements).map((element:any) => element.innerText);
// // // // // //     });

// // // // // //     // Close the browser
// // // // // //     await browser.close();

// // // // // //     return captions;
// // // // // // }

// // // // // // // Replace with the URL of the YouTube video you want to scrape
// // // // // // const videoUrl = 'https://www.youtube.com/watch?v=eTwn4qPqx4A';

// // // // // // getAutoGeneratedCaptions(videoUrl)
// // // // // //     .then(captions => {
// // // // // //         console.log('Auto-generated captions:', captions);
// // // // // //     })
// // // // // //     .catch(error => {
// // // // // //         console.error('Error fetching captions:', error);
// // // // // //     });

// // // // // const axios = require('axios');
// // // // // const cheerio = require('cheerio');

// // // // // async function getAutoGeneratedCaptions(videoUrl:any) {
// // // // //   try {
// // // // //     // Make a request to the YouTube video page
// // // // //     const response = await axios.get(videoUrl);

// // // // //     // Parse the HTML response using Cheerio
// // // // //     const $ = cheerio.load(response.data);

// // // // //     // Find the script tag containing the captions data
// // // // //     const captionsScript = $('script').filter((i:any, el:any) => {
// // // // //       return $(el).html().includes('window["ytInitialPlayerResponse"]');
// // // // //     }).first();

// // // // //     // Extract the captions data from the script tag
// // // // //     const captionsData = JSON.parse(
// // // // //       captionsScript
// // // // //         .html()
// // // // //         // .split('window["ytInitialPlayerResponse"] = ')[1]
// // // // //         // .split(';window["ytInitialVariables"]')[0]
// // // // //     );

// // // // //     // Filter the captions to get only the auto-generated ones
// // // // //     const autoGeneratedCaptions = captionsData.captions.playerCaptionsTracklistRenderer.captionTracks.filter(
// // // // //       (track:any) => track.vssId.startsWith('a.')
// // // // //     );

// // // // //     // Extract the caption texts
// // // // //     const captions = await Promise.all(
// // // // //       autoGeneratedCaptions.map(async (track:any) => {
// // // // //         const captionResponse = await axios.get(track.baseUrl + '&fmt=vtt');
// // // // //         return captionResponse.data;
// // // // //       })
// // // // //     );

// // // // //     return captions;
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching captions:', error);
// // // // //     throw error;
// // // // //   }
// // // // // }

// // // // // // Replace with the URL of the YouTube video you want to scrape
// // // // // const videoUrl = 'https://www.youtube.com/watch?v=eTwn4qPqx4A';

// // // // // getAutoGeneratedCaptions(videoUrl)
// // // // //   .then((captions) => {
// // // // //     console.log('Auto-generated captions:', captions);
// // // // //   })
// // // // //   .catch((error) => {
// // // // //     console.error('Error fetching captions:', error);
// // // // //   });

// // // // // import axios from "axios";
// // // // // import { XMLParser } from "fast-xml-parser";

// // // // // // Function to extract YouTube video ID from a URL
// // // // // const extractYouTubeVideoId = (url: any) => {
// // // // //   const regex =
// // // // //     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
// // // // //   const match = url.match(regex);
// // // // //   return match ? match[1] : null;
// // // // // };

// // // // // export const getYTSubtitleFromPage = async (ytlink: any) => {
// // // // //   const videoId = extractYouTubeVideoId(ytlink);

// // // // //   if (!videoId) {
// // // // //     console.error("Video ID not found");
// // // // //     return;
// // // // //   }

// // // // //   try {
// // // // //     // Fetch the video page content using axios
// // // // //     const response = await axios.get(
// // // // //       `https://www.youtube.com/watch?v=${videoId}`,
// // // // //       {
// // // // //         headers: {
// // // // //           "User-Agent":
// // // // //             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
// // // // //           "Accept-Language": "en-US,en;q=0.9",
// // // // //           Accept:
// // // // //             "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
// // // // //         },
// // // // //       }
// // // // //     );

// // // // //     const text = response.data;

// // // // //     // Parse the player response to extract captions
// // // // //     const playerResponsePattern = /ytInitialPlayerResponse\s*=\s*({.*?});/;
// // // // //     const match = playerResponsePattern.exec(text);

// // // // //     if (!match) {
// // // // //       console.error("Player response not found");
// // // // //       return;
// // // // //     }

// // // // //     const playerResponse = JSON.parse(match[1]);
// // // // //     const captionTracks =
// // // // //       playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

// // // // //     if (!captionTracks || captionTracks.length === 0) {
// // // // //       console.error("No caption tracks found");
// // // // //       return;
// // // // //     }

// // // // //     // Fetch the first caption track using axios
// // // // //     const subtitleUrl = captionTracks[0].baseUrl;
// // // // //     const subtitlesResponse = await axios.get(subtitleUrl, {
// // // // //       headers: {
// // // // //         "User-Agent":
// // // // //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
// // // // //       },
// // // // //     });

// // // // //     const subtitlesText = subtitlesResponse.data;

// // // // //     // Parse and display subtitles using fast-xml-parser
// // // // //     const parser = new XMLParser();
// // // // //     const xmlDoc = parser.parse(subtitlesText);
// // // // //     const texts = xmlDoc.transcript.text;

// // // // //     const subtitles = texts
// // // // //       .map((textNode: any) => {
// // // // //         return typeof textNode === "object" && "#text" in textNode
// // // // //           ? textNode["#text"]
// // // // //           : textNode;
// // // // //       })
// // // // //       .join("\n");

// // // // //     return {
// // // // //       subtitles,
// // // // //       title: playerResponse.videoDetails.title,
// // // // //       description: playerResponse.videoDetails.shortDescription,
// // // // //       videoDetailsData: {
// // // // //         channelId: playerResponse.videoDetails.channelId,
// // // // //         lengthSeconds: playerResponse.videoDetails.lengthSeconds,
// // // // //         keywords: playerResponse.videoDetails.keywords,
// // // // //         author: playerResponse.videoDetails.author,
// // // // //       },
// // // // //     };
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching and scraping:", error);
// // // // //     return null;
// // // // //   }
// // // // // };

// // // // // // Example usage
// // // // // getYTSubtitleFromPage("https://www.youtube.com/watch?v=7hr60EumwQ4")
// // // // //   .then((data) => {
// // // // //     console.log(data);
// // // // //   })
// // // // //   .catch(console.error);

// // // // // import axios from "axios";
// // // // // import { XMLParser } from "fast-xml-parser";

// // // // // // Function to extract YouTube video ID from a URL
// // // // // const extractYouTubeVideoId = (url: string): string | null => {
// // // // //   const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
// // // // //   const match = url.match(regex);
// // // // //   return match ? match[1] : null;
// // // // // };

// // // // // // Function to get YouTube subtitles
// // // // // export const getYTSubtitleFromPage = async (ytlink: string) => {
// // // // //   const videoId = extractYouTubeVideoId(ytlink);

// // // // //   if (!videoId) {
// // // // //     console.error("Video ID not found");
// // // // //     return null;
// // // // //   }

// // // // //   try {
// // // // //     // Fetch the video page content using axios
// // // // //     const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
// // // // //       headers: {
// // // // //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
// // // // //         'Accept-Language': 'en-US,en;q=0.9',
// // // // //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
// // // // //       }
// // // // //     });

// // // // //     const text = response.data;

// // // // //     // Parse the player response to extract captions
// // // // //     const playerResponsePattern = /ytInitialPlayerResponse\s*=\s*({.*?});/;
// // // // //     const match = playerResponsePattern.exec(text);

// // // // //     if (!match) {
// // // // //       console.error("Player response not found");
// // // // //       return null;
// // // // //     }

// // // // //     const playerResponse = JSON.parse(match[1]);
// // // // //     const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

// // // // //     if (!captionTracks || captionTracks.length === 0) {
// // // // //       console.error("No caption tracks found");
// // // // //       return null;
// // // // //     }

// // // // //     // Fetch the first caption track using axios
// // // // //     const subtitleUrl = captionTracks[0].baseUrl;
// // // // //     const subtitlesResponse = await axios.get(subtitleUrl, {
// // // // //       headers: {
// // // // //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
// // // // //       }
// // // // //     });

// // // // //     const subtitlesText = subtitlesResponse.data;

// // // // //     // Parse and display subtitles using fast-xml-parser
// // // // //     const parser = new XMLParser();
// // // // //     const xmlDoc = parser.parse(subtitlesText);
// // // // //     const texts = xmlDoc.transcript.text;

// // // // //     const subtitles = texts.map((textNode: any) => {
// // // // //       return typeof textNode === "object" && "#text" in textNode ? textNode["#text"] : textNode;
// // // // //     }).join("\n");

// // // // //     return {
// // // // //       subtitles,
// // // // //       title: playerResponse.videoDetails.title,
// // // // //       description: playerResponse.videoDetails.shortDescription,
// // // // //       videoDetailsData: {
// // // // //         channelId: playerResponse.videoDetails.channelId,
// // // // //         lengthSeconds: playerResponse.videoDetails.lengthSeconds,
// // // // //         keywords: playerResponse.videoDetails.keywords,
// // // // //         author: playerResponse.videoDetails.author,
// // // // //       }
// // // // //     };

// // // // //   } catch (error) {
// // // // //     console.error("Error fetching and scraping:", error);
// // // // //     return null;
// // // // //   }
// // // // // };

// // // // // // Example usage
// // // // // getYTSubtitleFromPage("https://www.youtube.com/watch?v=SATEUEKh7xA").then((data) => {
// // // // //   console.log(data);
// // // // // }).catch(console.error);

// // // // // import axios from 'axios';
// // // // // import { XMLParser } from 'fast-xml-parser';

// // // // // // Function to extract YouTube video ID from a URL
// // // // // const extractYouTubeVideoId = (url:any) => {
// // // // //   const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
// // // // //   const match = url.match(regex);
// // // // //   return match ? match[1] : null;
// // // // // };

// // // // // export const getYTSubtitleFromPage = async (ytlink:any) => {
// // // // //   const videoId = extractYouTubeVideoId(ytlink);

// // // // //   if (!videoId) {
// // // // //     console.error("Video ID not found");
// // // // //     return;
// // // // //   }

// // // // //   try {
// // // // //     // Fetch the video page content using axios
// // // // //     const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
// // // // //     const text = response.data;

// // // // //     // Parse the player response to extract captions
// // // // //     const playerResponsePattern = /ytInitialPlayerResponse\s*=\s*({.*?});/;
// // // // //     const match = playerResponsePattern.exec(text);

// // // // //     if (!match) {
// // // // //       console.error("Player response not found");
// // // // //       return;
// // // // //     }

// // // // //     const playerResponse = JSON.parse(match[1]);
// // // // //     const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

// // // // //     if (!captionTracks || captionTracks.length === 0) {
// // // // //       console.error("No caption tracks found");
// // // // //       return;
// // // // //     }

// // // // //     // Fetch the first caption track using axios
// // // // //     const subtitleUrl = captionTracks[0].baseUrl;
// // // // //     const subtitlesResponse = await axios.get(subtitleUrl);
// // // // //     const subtitlesText = subtitlesResponse.data;

// // // // //     // Parse and display subtitles using fast-xml-parser
// // // // //     const parser = new XMLParser();
// // // // //     const xmlDoc = parser.parse(subtitlesText);
// // // // //     const texts = xmlDoc.transcript.text;

// // // // //     const subtitles = texts.map((textNode:any) => {
// // // // //       return typeof textNode === "object" && "#text" in textNode ? textNode["#text"] : textNode;
// // // // //     }).join("\n");

// // // // //     return {
// // // // //       subtitles,
// // // // //       title: playerResponse.videoDetails.title,
// // // // //       description: playerResponse.videoDetails.shortDescription,
// // // // //       videoDetailsData: {
// // // // //         channelId: playerResponse.videoDetails.channelId,
// // // // //         lengthSeconds: playerResponse.videoDetails.lengthSeconds,
// // // // //         keywords: playerResponse.videoDetails.keywords,
// // // // //         author: playerResponse.videoDetails.author,
// // // // //       }
// // // // //     };

// // // // //   } catch (error) {
// // // // //     console.error("Error fetching and scraping:", error);
// // // // //     return null;
// // // // //   }
// // // // // };

// // // // /**
// // // //  * The function `getYTSubtitleFromPage` fetches and logs the transcript subtitles of a YouTube video
// // // //  * given its link.
// // // //  * @param {string} ytlink - The `ytlink` parameter in the `getYTSubtitleFromPage` function is a string
// // // //  * that represents the YouTube video link from which you want to fetch the transcript. In the example
// // // //  * provided, the function is fetching the transcript for the YouTube video with the link
// // // //  * "https://www.youtube.com/watch?v
// // // //  */
// // // // // import { YoutubeTranscript } from "youtube-transcript";

// // // // // // Fetch the transcript for a YouTube video
// // // // // const getYTSubtitleFromPage = async (ytlink: string) => {
// // // // // const data: any = await YoutubeTranscript.fetchTranscript("7hr60EumwQ4");
// // // // // const subtitles = data.map((singleSubs: any) => singleSubs.text.trim()).join("\n");
// // // // // console.log(subtitles, "subtitles");
// // // // // }

// // // // // // Example usage
// // // // // getYTSubtitleFromPage("https://www.youtube.com/watch?v=7hr60EumwQ4").then((data) => {
// // // // //   console.log(data);
// // // // // }).catch(console.error);

// // // // import axios from 'axios';
// // // // // import { XMLParser } from 'fast-xml-parser';
// // // // import { YoutubeTranscript, YoutubeTranscriptDisabledError } from 'youtube-transcript';

// // // // // Function to extract YouTube video ID from a URL
// // // // const extractYouTubeVideoId = (url: string) => {
// // // //   const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
// // // //   const match = url.match(regex);
// // // //   return match ? match[1] : null;
// // // // };

// // // // export const getYTSubtitleFromPage = async (ytlink: string) => {
// // // //   const videoId = extractYouTubeVideoId(ytlink);

// // // //   if (!videoId) {
// // // //     console.error("Video ID not found");
// // // //     return;
// // // //   }

// // // //   try {
// // // //     // Attempt to fetch the transcript using youtube-transcript
// // // //     const data: any = await YoutubeTranscript.fetchTranscript(videoId);
// // // //     const subtitles = data.map((singleSubs: any) => singleSubs.text.trim()).join("\n");

// // // //     // Fetch video details
// // // //     const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
// // // //     const text = response.data;

// // // //     // Parse the player response to extract captions
// // // //     const playerResponsePattern = /ytInitialPlayerResponse\s*=\s*({.*?});/;
// // // //     const match = playerResponsePattern.exec(text);

// // // //     if (!match) {
// // // //       console.error("Player response not found");
// // // //       return;
// // // //     }

// // // //     const playerResponse = JSON.parse(match[1]);
// // // //     const videoDetails = playerResponse.videoDetails;

// // // //     return {
// // // //       subtitles,
// // // //       title: videoDetails.title,
// // // //       description: videoDetails.shortDescription,
// // // //       videoDetailsData: {
// // // //         channelId: videoDetails.channelId,
// // // //         lengthSeconds: videoDetails.lengthSeconds,
// // // //         keywords: videoDetails.keywords,
// // // //         author: videoDetails.author,
// // // //       }
// // // //     };

// // // //   } catch (error) {
// // // //     if (error instanceof YoutubeTranscriptDisabledError) {
// // // //       console.error("Transcript is disabled for this video.");
// // // //     } else {
// // // //       console.error("Error fetching and scraping:", error);
// // // //     }
// // // //     return null;
// // // //   }
// // // // };

// // // // // Example usage
// // // // getYTSubtitleFromPage("https://www.youtube.com/watch?v=7hr60EumwQ4!").then((data) => {
// // // //   console.log(data);
// // // // }).catch(console.error);

// // // // // import { YoutubeTranscript } from 'youtube-transcript';
// // // // // import { writeFile } from 'fs';

// // // // // async function fetchAndStoreTranscript() {
// // // // //   try {
// // // // //     const transcript = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=ehAGlT9DJZ4');
// // // // //     const transcriptData = JSON.stringify(transcript);
// // // // //     console.log(transcript);

// // // // // //the code for file handling
// // // // //     writeFile('transcript.json', transcriptData, (err) => {
// // // // //       if (err) throw err;
// // // // //       console.log('Transcript data has been saved to transcript.json');
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching or storing the transcript:', error);
// // // // //   }
// // // // // }

// // // // // fetchAndStoreTranscript();

// // // // import axios from 'axios';

// // // // // Define the function to fetch subtitles
// // // // const fetchSubtitles = async (videoId: string): Promise<void> => {
// // // //     const url = `https://subtitles-for-youtube.p.rapidapi.com/subtitles/${videoId}.srt?type=None&translated=None`;

// // // //     const options = {
// // // //         method: 'GET',
// // // //         url: url,
// // // //         headers: {
// // // //             'x-rapidapi-key': 'dffa42184fmsh85b69293984169ep1f0ccejsn32857a7b7ecf', // Make sure to replace with your actual API key
// // // //             'x-rapidapi-host': 'subtitles-for-youtube.p.rapidapi.com'
// // // //         }
// // // //     };

// // // //     try {
// // // //         const response = await axios.request(options);
// // // //         console.log(response.data);
// // // //     } catch (error) {
// // // //         if (axios.isAxiosError(error)) {
// // // //             console.error('Error message:', error.message);
// // // //         } else {
// // // //             console.error('Unexpected error:', error);
// // // //         }
// // // //     }
// // // // };

// // // // // Example usage
// // // // const videoId = '7hr60EumwQ4'; // Replace with the actual video ID
// // // // fetchSubtitles(videoId);

// // // // const axios = require("axios");
// // // // const getSub = async (videoId: string) => {
// // // //   const options = {
// // // //     method: "GET",
// // // //     url: `https://subtitles-for-youtube.p.rapidapi.com/subtitles/7hr60EumwQ4.srt`,
// // // //     params: {
// // // //       type: "None",
// // // //       translated: "None",
// // // //     },
// // // //     headers: {
// // // //       "x-rapidapi-key": "dffa42184fmsh85b69293984169ep1f0ccejsn32857a7b7ecf",
// // // //       "x-rapidapi-host": "subtitles-for-youtube.p.rapidapi.com",
// // // //     },
// // // //   };

// // // //   try {
// // // //     const response = await axios.request(options);
// // // //     console.log(response.data);
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //   }
// // // // };

// // // // getSub("7hr60EumwQ4").then(console.log)

// // // const { google } = require("googleapis");
// // // const ytdl = require("ytdl-core");
// // // const fs = require("fs");

// // // const API_KEY = "AIzaSyBR0BnoWKko4hBKqObtJsvtFx22dcdOx3w";
// // // const youtube = google.youtube({
// // //   version: "v3",

// // //   auth: API_KEY,
// // // });

// // // async function getSubtitles(videoUrl: string) {
// // //   try {
// // //     const videoId = ytdl.getVideoID(videoUrl);

// // //     // Fetch video details
// // //     const response = await youtube.captions.list({
// // //       part: "snippet",
// // //       videoId: videoId,
// // //     });

// // //     const captions = response.data.items;
// // //     if (captions.length === 0) {
// // //       console.log("No captions found for this video.");
// // //       return;
// // //     }

// // //     // Find English captions (or the first available)
// // //     const captionTrack =
// // //       captions.find((c: any) => c.snippet.language === "en") || captions[0];

// // //     // Download the caption track
// // //     const captionResponse = await youtube.captions.download({
// // //       id: captionTrack.id,
// // //       tfmt: "srt",
// // //     });

// // //     // Write subtitles to a file
// // //     fs.writeFileSync("subtitles.srt", captionResponse.data);
// // //     console.log("Subtitles downloaded successfully.");
// // //   } catch (error) {
// // //     console.error("An error occurred:", error.message);
// // //   }
// // // }

// // // // Usage
// // // const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with your video URL
// // // getSubtitles(videoUrl);

// // const { google } = require("googleapis");
// // const ytdl = require("ytdl-core");
// // const fs = require("fs");
// // const path = require("path");
// // const readline = require("readline");

// // // Load client secrets from a local file.
// // const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
// // const TOKEN_PATH = path.join(__dirname, "token.json");

// // const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

// // // Create an OAuth2 client with the given credentials
// // async function authorize() {
// //   const { client_secret, client_id, redirect_uris } = JSON.parse(
// //     fs.readFileSync(CREDENTIALS_PATH)
// //   ).web;
// //   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// //   // Check if we have previously stored a token.
// //   if (fs.existsSync(TOKEN_PATH)) {
// //     const token = fs.readFileSync(TOKEN_PATH);
// //     oAuth2Client.setCredentials(JSON.parse(token));
// //     return oAuth2Client;
// //   } else {
// //     return getAccessToken(oAuth2Client);
// //   }
// // }

// // // Get and store access token after prompting for user authorization
// // async function getAccessToken(oAuth2Client:any) {
// //   const authUrl = oAuth2Client.generateAuthUrl({
// //     access_type: "offline",
// //     scope: SCOPES,
// //   });
// //   console.log("Authorize this app by visiting this url:", authUrl);
// //   const rl = readline.createInterface({
// //     input: process.stdin,
// //     output: process.stdout,
// //   });
// //   rl.question("Enter the code from that page here: ", async (code:any) => {
// //     rl.close();
// //     const { tokens } = await oAuth2Client.getToken(code);
// //     oAuth2Client.setCredentials(tokens);
// //     fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
// //     console.log("Token stored to", TOKEN_PATH);
// //   });
// //   return oAuth2Client;
// // }

// // async function getSubtitles(videoUrl:any) {
// //   try {
// //     const videoId = ytdl.getVideoID(videoUrl);
// //     const youtube = google.youtube({ version: "v3", auth: await authorize() });

// //     // Fetch video details
// //     const response = await youtube.captions.list({
// //       part: "snippet",
// //       videoId: videoId,
// //     });

// //     const captions = response.data.items;
// //     if (captions.length === 0) {
// //       console.log("No captions found for this video.");
// //       return;
// //     }

// //     // Find English captions (or the first available)
// //     const captionTrack =
// //       captions.find((c:any) => c.snippet.language === "en") || captions[0];

// //     // Download the caption track
// //     const captionResponse = await youtube.captions.download({
// //       id: captionTrack.id,
// //       tfmt: "srt",
// //     });

// //     // Write subtitles to a file
// //     fs.writeFileSync("subtitles.srt", captionResponse.data);
// //     console.log("Subtitles downloaded successfully.");
// //   } catch (error) {
// //     console.error("An error occurred:", error.message);
// //   }
// // }

// // // Usage
// // const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with your video URL
// // getSubtitles(videoUrl);

// // Working code

// import https from 'https';
// import querystring from 'querystring';

// interface Subtitle {
//     start: number;
//     duration: number;
//     text: string;
// }

// interface Caption {
//     baseUrl: string;
// }

// function getVideoId(url: string): string | null {
//     const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
//     const match = url.match(videoIdRegex);
//     return match ? match[1] : null;
// }

// function getSubtitles(videoId: string): Promise<Subtitle[]> {
//     return new Promise((resolve, reject) => {
//         const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

//         https.get(videoUrl, (res) => {
//             let data = '';
//             res.on('data', (chunk: string) => data += chunk);
//             res.on('end', () => {
//                 try {
//                     const playerResponseMatch = data.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;/);
//                     if (!playerResponseMatch) {
//                         throw new Error('Unable to find player response data');
//                     }

//                     const playerResponse = JSON.parse(playerResponseMatch[1]);
//                     const captions: Caption[] = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;

//                     if (!captions || captions.length === 0) {
//                         throw new Error('No captions found for this video');
//                     }

//                     const subtitleUrl = captions[0].baseUrl;
//                     https.get(subtitleUrl, (res) => {
//                         let subtitleData = '';
//                         res.on('data', (chunk: string) => subtitleData += chunk);
//                         res.on('end', () => {
//                             const subtitleParts = subtitleData.match(/<text start="(.+?)" dur="(.+?)">(.+?)<\/text>/g);
//                             if (!subtitleParts) {
//                                 throw new Error('Unable to parse subtitle data');
//                             }
//                             const subtitles: Subtitle[] = subtitleParts.map(part => {
//                                 const match = part.match(/<text start="(.+?)" dur="(.+?)">(.+?)<\/text>/);
//                                 if (!match) {
//                                     throw new Error('Invalid subtitle format');
//                                 }
//                                 const [, start, duration, text] = match;
//                                 return {
//                                     start: parseFloat(start),
//                                     duration: parseFloat(duration),
//                                     text: querystring.unescape(text).replace(/<[^>]*>/g, '')
//                                 };
//                             });
//                             resolve(subtitles);
//                         });
//                     }).on('error', reject);
//                 } catch (error) {
//                     reject(error);
//                 }
//             });
//         }).on('error', reject);
//     });
// }

// async function main() {
//     const subs:any = [];
//     const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your video URL
//     const videoId = getVideoId(videoUrl);

//     if (!videoId) {
//         console.log('Invalid YouTube URL');
//         return;
//     }

//     try {
//         const subtitles = await getSubtitles(videoId);
//         subtitles.forEach(entry => {
//             // console.log(`${entry.start.toFixed(2)} - ${(entry.start + entry.duration).toFixed(2)}: ${entry.text}`);
//             // console.log(`${entry.text}`);
//             subs.push(entry.text)
//         });
//         console.log(subs.join(" "))
//     } catch (error) {
//         console.error('Failed to retrieve subtitles:', (error as Error).message);
//     }
// }

// // main();

// // working code end
