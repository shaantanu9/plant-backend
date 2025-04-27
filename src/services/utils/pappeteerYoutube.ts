import { XMLParser } from 'fast-xml-parser';
import puppeteer from 'puppeteer';
import { extractYouTubeVideoId } from './isYoutubeLink';
// import { getYTDataFromAPI } from "./youtubeVideoDetail";

export const getYTSubtitleFromPage = async (ytlink: string) => {
  const videoId = extractYouTubeVideoId(ytlink);

  if (!videoId) {
    console.error('Video ID not found');
    return;
  }

  let browser;
  try {
    // Launch a headless browser instance
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the YouTube video page
    await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
      waitUntil: 'networkidle2',
    });

    // Extract the ytInitialPlayerResponse variable from the page
    const playerResponse = await page.evaluate(() => {
      const ytInitialPlayerResponse: any = (window as any)['ytInitialPlayerResponse'];
      return ytInitialPlayerResponse;
    });

    if (!playerResponse) {
      console.error('Player response not found');
      return;
    }

    // Extract video details
    const videoDetails = playerResponse.videoDetails;
    const title = videoDetails?.title;
    const description = videoDetails?.shortDescription;

    // Check if captions are available
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captionTracks || captionTracks.length === 0) {
      console.error('No caption tracks found');
      return;
    }

    // Fetch the first caption track using Puppeteer
    const subtitleUrl = captionTracks[0].baseUrl;
    await page.goto(subtitleUrl, { waitUntil: 'networkidle2' });
    const subtitlesText = await page.content();

    // Parse and display subtitles using fast-xml-parser
    const parser = new XMLParser();
    const xmlDoc = parser.parse(subtitlesText);

    // Extract the texts
    const texts = xmlDoc.transcript.text;

    // Handle different subtitle formats
    const subtitles = texts
      .map((textNode: string) => {
        if (typeof textNode === 'string') {
          return textNode; // For plain text nodes
        } else if (typeof textNode === 'object' && '#text' in textNode) {
          return textNode['#text']; // For nodes with nested text content
        }
        return '';
      })
      .join('\n');

    const videoDetailsData = {
      channelId: videoDetails.channelId,
      lengthSeconds: videoDetails.lengthSeconds,
      keywords: videoDetails.keywords,
      author: videoDetails.author,
    };

    return { subtitles, title, description, videoDetailsData };
  } catch (error) {
    console.error('Error fetching and scraping:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

getYTSubtitleFromPage('https://www.youtube.com/watch?v=9bZkp7q19f0');
