import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';

// Fetching Subtitles
export const fetchSubtitles = async (videoID: string, lang = 'en') => {
  try {
    const subtitles = await getSubtitles({ videoID, lang });
    console.log(subtitles);
  } catch (error) {
    console.error('Error fetching subtitles:', error);
  }
};

// Fetching Video Details
export const fetchVideoDetails = async (videoID: string, lang = 'en') => {
  try {
    const videoDetails = await getVideoDetails({ videoID, lang });
    console.log(videoDetails);
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
};
