import axios from 'axios';
import cheerio from 'cheerio';

interface ScrapeResult {
  title: string;
  body: string;
}

export const scrapePage = async (url: string): Promise<ScrapeResult | null> => {
  try {
    // Fetch the HTML of the webpage
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Extract the title
    const title = $('title').text();

    // Extract the body text
    const body = $('body').text();

    // Return the extracted data
    return { title, body };
  } catch (error) {
    console.error('Error fetching the webpage:', error);
    return null;
  }
};
