const https = require('https');
const querystring = require('querystring');

function getVideoId(url) {
    const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
}

function getSubtitles(videoId) {
    return new Promise((resolve, reject) => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        https.get(videoUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const playerResponseMatch = data.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;/);
                    if (!playerResponseMatch) {
                        throw new Error('Unable to find player response data');
                    }

                    const playerResponse = JSON.parse(playerResponseMatch[1]);
                    const captions = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;

                    if (!captions || captions.length === 0) {
                        throw new Error('No captions found for this video');
                    }

                    const subtitleUrl = captions[0].baseUrl;
                    https.get(subtitleUrl, (res) => {
                        let subtitleData = '';
                        res.on('data', (chunk) => subtitleData += chunk);
                        res.on('end', () => {
                            const subtitleParts = subtitleData.match(/<text start="(.+?)" dur="(.+?)">(.+?)<\/text>/g);
                            if (!subtitleParts) {
                                throw new Error('Unable to parse subtitle data');
                            }
                            const subtitles = subtitleParts.map(part => {
                                const match = part.match(/<text start="(.+?)" dur="(.+?)">(.+?)<\/text>/);
                                if (!match) {
                                    throw new Error('Invalid subtitle format');
                                }
                                const [, start, duration, text] = match;
                                return {
                                    start: parseFloat(start),
                                    duration: parseFloat(duration),
                                    text: querystring.unescape(text).replace(/<[^>]*>/g, '')
                                };
                            });
                            resolve(subtitles);
                        });
                    }).on('error', reject);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    const subs = [];
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your video URL
    const videoId = getVideoId(videoUrl);
    
    if (!videoId) {
        console.log('Invalid YouTube URL');
        return;
    }

    try {
        const subtitles = await getSubtitles(videoId);
        subtitles.forEach(entry => {
            subs.push(entry.text)
        });
        console.log(subs.join(" "))
    } catch (error) {
        console.error('Failed to retrieve subtitles:', error.message);
    }
}

main();