// import { exec } from "child_process";
// import { promises as fs } from "fs"; // Use the Promise-based version of fs
// import path from "path";

// // Function to download YouTube subtitles
// async function CMDYoutubeSubtitle(
//   videoId: string
// ): Promise<string | undefined> {
//   // Create a directory for the video ID
//   const dir = path.join(__dirname, videoId);
//   console.log(`Creating directory at: ${dir}`);
//   try {
//     await fs.mkdir(dir, { recursive: true });

//     // Construct the yt-dlp command
//     const command = `yt-dlp --skip-download --write-auto-subs --sub-lang en --convert-subs vtt -o "${dir}/%(id)s.%(ext)s" "https://www.youtube.com/watch?v=${videoId}"`;
//     console.log(`Executing command: ${command}`);

//     // Execute the command
//     await execPromise(command, { cwd: dir });

//     // Read the downloaded WebVTT file
//     return await cleanVTTFile(videoId);
//   } catch (error) {
//     console.error(`Error: ${(error as Error).message}`);
//     return undefined;
//   }
// }

// // Function to execute a command and return a promise
// const execPromise = (
//   command: string,
//   options?: { cwd?: string }
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     exec(command, options, (error, stdout: any, stderr: any) => {
//       if (error) {
//         console.error(`Error executing command: ${error.message}`);
//         console.error(`stderr: ${stderr}`);
//         reject(error);
//       } else {
//         resolve(stdout);
//       }
//     });
//   });
// };

// const cleanVTTFile = async (videoId: string): Promise<string | undefined> => {
//   const extractRelevantLines = (text: string): string => {
//     return text
//       .replace(/WEBVTT.*/g, "") // Remove WEBVTT headers
//       .replace(/Kind:.*/g, "") // Remove Kind metadata
//       .replace(/Language:.*/g, "") // Remove Language metadata
//       .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
//       .trim()
//       .split("\n")
//       .filter((line) => /^[^\d]/.test(line) && !/00:/.test(line)) // Only lines that don't start with digits and don't contain "00:"
//       .map((line) => line.trim()) // Trim each line
//       .join("\n");
//   };

//   const cleanAndDeduplicateLines = (text: string): string => {
//     const lines = text.split("\n");
//     const cleanedLines = new Set<string>();

//     lines.forEach((line) => {
//       const cleanedLine = line.replace(/<.*?>/g, "").trim(); // Remove HTML-like tags and trim the line

//       if (cleanedLine) {
//         cleanedLines.add(cleanedLine); // Add only unique cleaned lines
//       }
//     });

//     return Array.from(cleanedLines).join(" "); // Join cleaned lines into a single string
//   };

//   const vttFilePath = path.join(__dirname, videoId, `${videoId}.en.vtt`);
//   const vttContent = await fs.readFile(vttFilePath, "utf8");

//   // Extract relevant lines from the VTT content
//   const relevantText = extractRelevantLines(vttContent);

//   // Clean and deduplicate the relevant lines
//   const cleanedText = cleanAndDeduplicateLines(relevantText);

//   if (cleanedText) {
//     // Remove the video directory if cleaning was successful
//     // await fs.rm(videoId, { recursive: true, force: true });
//     return cleanedText;
//   }
//   return undefined;
// };

// export default CMDYoutubeSubtitle;

import { exec } from 'child_process';
import { promises as fs } from 'fs'; // Use the Promise-based version of fs
import path from 'path';

// Function to download YouTube subtitles and get video details
async function CMDYoutubeSubtitle(videoId: string): Promise<string | undefined> {
  // Create a directory for the video ID
  const dir = path.join(__dirname, videoId);
  console.log(`Creating directory at: ${dir}`);
  try {
    await fs.mkdir(dir, { recursive: true });

    // Construct the yt-dlp command to download subtitles
    const subtitleCommand = `yt-dlp --cookies cookies.txt --skip-download --write-auto-subs --sub-lang en --convert-subs vtt -o "${dir}/%(id)s.%(ext)s" "https://www.youtube.com/watch?v=${videoId}"`;
    console.log(`Executing command for subtitles: ${subtitleCommand}`);

    // Execute the command to download subtitles
    await execPromise(subtitleCommand, { cwd: dir });

    // Read the downloaded WebVTT file
    const cleanedText = await cleanVTTFile(videoId);

    // Get video details using yt-dlp
    const videoDetails = await getYouTubeVideoDetails(videoId);
    // console.log("Video Details:", videoDetails);

    // Return cleaned subtitles and video details
    return {
      ...videoDetails,
      subtitle: cleanedText,
    };
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    return undefined;
  }
}

// Function to execute a command and return a promise
const execPromise = (command: string, options?: { cwd?: string }): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Function to clean the VTT file
const cleanVTTFile = async (videoId: string): Promise<string | undefined> => {
  const extractRelevantLines = (text: string): string => {
    return text
      .replace(/WEBVTT.*/g, '') // Remove WEBVTT headers
      .replace(/Kind:.*/g, '') // Remove Kind metadata
      .replace(/Language:.*/g, '') // Remove Language metadata
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
      .trim()
      .split('\n')
      .filter(line => /^[^\d]/.test(line) && !/00:/.test(line)) // Only lines that don't start with digits and don't contain "00:"
      .map(line => line.trim()) // Trim each line
      .join('\n');
  };

  const cleanAndDeduplicateLines = (text: string): string => {
    const lines = text.split('\n');
    const cleanedLines = new Set<string>();

    lines.forEach(line => {
      const cleanedLine = line.replace(/<.*?>/g, '').trim(); // Remove HTML-like tags and trim the line

      if (cleanedLine) {
        cleanedLines.add(cleanedLine); // Add only unique cleaned lines
      }
    });

    return Array.from(cleanedLines).join(' '); // Join cleaned lines into a single string
  };

  const vttFilePath = path.join(__dirname, videoId, `${videoId}.en.vtt`);
  const vttContent = await fs.readFile(vttFilePath, 'utf8');

  // Extract relevant lines from the VTT content
  const relevantText = extractRelevantLines(vttContent);

  // Clean and deduplicate the relevant lines
  const cleanedText = cleanAndDeduplicateLines(relevantText);

  if (cleanedText) {
    await fs.rm(videoId, { recursive: true, force: true });
    await fs.unlink(vttFilePath);
    await fs.rm(path.join(__dirname, videoId), {
      recursive: true,
      force: true,
    });
    console.log('Deleted directory:', videoId);
    return cleanedText;
  }
  return undefined;
};

// Function to get YouTube video details using yt-dlp
async function getYouTubeVideoDetails(videoId: string): Promise<any> {
  const command = `yt-dlp  --cookies cookies.txt --skip-download --dump-json "https://www.youtube.com/watch?v=${videoId}"`;

  try {
    const videoInfo = await execPromise(command);
    // fs.writeFile(path.join(__dirname, videoId, `${videoId}.json`), videoInfo); // Save the video details to a JSON file
    const allData = JSON.parse(videoInfo); // Return the parsed video details
    const detail = {
      videoId: allData.id,
      title: allData.title,
      description: allData.description,
      duration: allData.duration,
      viewCount: allData.view_count,
      category: allData.categories,
      tags: allData.tags,
      channelId: allData.channel_id,
      uploader_id: allData.uploader_id,
    };
    return detail;
  } catch (error) {
    console.error(`Failed to fetch video details: ${(error as Error).message}`);
    return undefined;
  }
}

// https://www.youtube.com/watch?v=
// CMDYoutubeSubtitle("yCy-geHQwIw").then(console.log);
export default CMDYoutubeSubtitle;
