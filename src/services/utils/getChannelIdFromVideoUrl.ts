import axios from 'axios';

export const getChannelIdFromVideoUrl = async (videoId: string) => {
  if (!videoId) return { channelId: '', keywords: [] };
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const response = await axios({
    method: 'get',
    url: url,
  });

  console.log('response.data VIDEOID', videoId);
  const channelId = response.data.match(/channelId":"(.*?)"/)?.[1];
  console.log(channelId, 'channelId');
  const keywordsMatch = response.data.match(/<meta name="keywords" content="(.*?)">/);
  const keywords = keywordsMatch ? keywordsMatch[1].split(', ') : [];

  return { channelId, keywords };
};
