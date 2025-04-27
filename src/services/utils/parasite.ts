import axios, { AxiosRequestConfig } from 'axios';
import randomstring from 'randomstring';
import { CookieJar } from 'tough-cookie';
// import { extractYouTubeVideoId } from "./extractYTId";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  jar?: any;
}

export const parasite = async (videoId: string) => {
  const cookieJar = new CookieJar();
  const config: CustomAxiosRequestConfig = {
    jar: cookieJar,
    headers: {
      'User-Agent': `Mozilla/5.0 (${randomstring.generate({
        length: 5,
        charset: 'alphabetic',
      })}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomstring.generate({
        length: 2,
        charset: 'numeric',
      })}.0.${randomstring.generate({
        length: 4,
        charset: 'numeric',
      })}.${randomstring.generate({
        length: 3,
        charset: 'numeric',
      })} Safari/537.36`,
      'X-Requested-With': 'XMLHttpRequest',
      'X-Real-IP': `${randomstring.generate({
        length: 3,
        charset: 'numeric',
      })}.${randomstring.generate({
        length: 3,
        charset: 'numeric',
      })}.${randomstring.generate({
        length: 3,
        charset: 'numeric',
      })}.${randomstring.generate({ length: 3, charset: 'numeric' })}`,
    },
  };
  const url =
    'https://youtubechanneltranscripts.com/api/videos?apiEndpoint=download-caption&lang=en&format=txt';

  try {
    const response = await axios.post(
      url,
      {
        videoId: videoId,
        apiEndpoint: 'download-caption',
      },
      config,
    );

    // Check if response data is available
    if (response && response.data) {
      return response.data;
    } else {
      // If no data in English, try fetching in Hindi
      const hiUrl =
        'https://youtubechanneltranscripts.com/api/videos?apiEndpoint=download-caption&lang=hi&format=txt';

      const hiResponse = await axios.post(
        hiUrl,
        {
          videoId: videoId,
          apiEndpoint: 'download-caption',
        },
        config,
      );

      // Check if Hindi subtitles are available
      if (hiResponse && hiResponse.data) {
        return hiResponse.data;
      } else {
        throw new Error('No subtitles found in English or Hindi');
      }
    }
  } catch (err) {
    throw new Error('Failed to fetch subtitles: ' + err.message);
  }
};

// https://www.youtube.com/watch?v=CK6uYrvD8qc
// https://www.youtube.com/watch?v=dQLEyHqo5bc&pp=ygUMY2ltcHV0ZXIgZW5n
// parasite("kqtD5dpn9C8").then(console.log).catch(console.error)
