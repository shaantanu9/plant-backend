// Function to fetch and scrape data from a URL
export const fetchUrlHTMLDetail = async (url: string) => {
  try {
    // Fetch the HTML content of the page
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the HTML content as text
    const htmlText = await response.text();

    // Create a DOM parser to parse the HTML text
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Example: Scrape specific elements from the page
    const scrapedData: any = [];
    const elements = doc.querySelectorAll('h1'); // Change this selector to target different elements

    elements.forEach(element => {
      scrapedData.push(element.textContent);
    });

    // Log or return the scraped data
    console.log(scrapedData);
    return scrapedData;
  } catch (error) {
    console.error('Error fetching and scraping:', error);
  }
};
