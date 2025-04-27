// // const url = require('url');

// export const extractYouTubeVideoId = (ytUrl:string) => {
//   try {
//     // Parse the URL
//     const parsedUrl = new URL(ytUrl);

//     // Check if the URL is from YouTube
//     const isYouTube = parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com';
//     if (!isYouTube) {
//       console.error('The provided URL is not a YouTube URL');
//       return null;
//     }

//     // Check if the pathname is correct
//     if (parsedUrl.pathname !== '/watch') {
//       console.error('The provided URL does not have a valid YouTube watch URL');
//       return null;
//     }

//     // Extract the video ID
//     const videoId = parsedUrl.searchParams.get('v');
//     if (!videoId) {
//       console.error('Video ID not found');
//       return null;
//     }

//     return videoId;
//   } catch (error) {
//     console.error('Invalid URL provided:', error.message);
//     return null;
//   }
// };

// // // Example usage
// // const testUrls = [
// //   'https://www.youtube.com/watch?v=gcOyAwm2zp8&list=RDGMEMCMFH2exzjBeE_zAHHJOdxg&index=11&ab_channel=King',
// //   'https://www.youtube.com/watch?v=gcOyAwm2zp8&list=RDGMEMCMFH2exzjBeE_zAHHJOdxg',
// //   'https://www.youtube.com/watch?v=gcOyAwm2zp8',
// //   'https://www.youtubee.com/watch?v=gcOyAwm2zp8', // Invalid YouTube domain
// //   'https://vimeo.com/123456789' // Non-YouTube URL
// // ];

// // testUrls.forEach((url) => {
// //   const videoId = extractYouTubeVideoId(url);
// //   if (videoId) {
// //     console.log(`Video ID extracted from ${url} is ${videoId}`);
// //   }
// // });

export const extractYouTubeVideoId = (ytUrl: string) => {
  try {
    // Parse the URL
    const parsedUrl = new URL(ytUrl);

    // Normalize hostname
    const hostname = parsedUrl.hostname.replace('www.', '').toLowerCase();

    // Check if the URL is from YouTube or youtu.be
    const isYouTube = ['youtube.com', 'youtu.be'].includes(hostname);
    if (!isYouTube) {
      console.error('The provided URL is not a YouTube URL');
      return null;
    }

    // Handle youtu.be format
    if (hostname === 'youtu.be') {
      return parsedUrl.pathname.substring(1); // Extract video ID directly from pathname
    }

    // Handle various YouTube paths
    const videoId = parsedUrl.searchParams.get('v'); // Standard YouTube watch URL
    if (videoId) {
      return videoId;
    }

    // Check for embedded and other paths
    const paths = ['/embed/', '/v/'];
    const path = parsedUrl.pathname;
    for (const p of paths) {
      if (path.startsWith(p)) {
        return path.substring(p.length);
      }
    }

    // If no valid ID was extracted
    console.error('No valid YouTube video ID found');
    return null;
  } catch (error: any) {
    console.error('Invalid URL provided:', error.message);
    return null;
  }
};

export const isCourseraLink = (url: string) => {
  const courseraPattern = /(?:https?:\/\/)?(?:www\.)?(?:coursera\.org\/learn\/)([a-zA-Z0-9_-]+)/;
  return courseraPattern.test(url);
};
