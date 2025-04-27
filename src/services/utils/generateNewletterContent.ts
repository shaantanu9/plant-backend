// import axios from "axios";
import { generateContent } from './gemeniModel';

export const generateNewletterContent = async (subtitles: string) => {
  const prompt =
    subtitles +
    ` I have text summaries from multiple videos that I would like you to format into a visually appealing and highly engaging newsletter. Here's what I'm looking for:
Attention-Grabbing Headline: Create a compelling headline that encapsulates the main topic or overarching theme of the videos.
Engaging Introduction: Start with a brief introduction that hooks the reader by providing context and setting the tone for the rest of the newsletter. Focus on how the videos connect or share a common theme.
Subheadings for Structure: Break the content into digestible sections using clear, catchy subheadings. Each section should focus on a specific video or a related idea from the summaries.
Visual Appeal: Incorporate relevant images, graphics, or charts that visually represent the key points from the video summaries. Use visuals to break up text and maintain reader engagement.
Key Takeaways and Quotes: Highlight the most impactful quotes, statistics, or insights from the video summaries. These should be presented as standout sections or within boxes to draw attention.
Curated Resources: Add additional context by linking to external resources, articles, or interviews mentioned in the videos to enhance the value of the newsletter.
Call to Action (CTA): End with a strong, persuasive CTA encouraging the reader to watch the full videos, sign up for a related course, or explore further content on the topic.
Psychological Engagement: Use emotion-driven language and storytelling techniques to draw the reader in. Tap into curiosity, inspiration, or urgency to keep them hooked throughout.
Clear and Modern Layout: Ensure a consistent, easy-to-read layout with ample white space, clear fonts, and a professional design. The newsletter should be designed for both desktop and mobile viewing.
    `;

  const content = await generateContent(prompt);

  //   get image from unsplash api and add it to the content
  // const imageGenerationsPrompt =
  //   content +
  //   ` I have the newsletter content ready and I would like to add relevant images to make it visually appealing. The images should complement the text and enhance the overall reading experience. give me some keywords that describe the content, and I am going to search for images based on these keywords on pixabay and unsplash. so please provide me with some keywords that not exceed 100 character that describe the content and are relevant to the text provided. Give in a comma-separated format so that i can use .split(',') to convert it into an array. in answer just me the the keyword no other text`;
  // const imagesKeywords = await generateContent(imageGenerationsPrompt);

  // # https://pixabay.com/api/?key=8944924-02822a2c61f0b606cb0636320&q=using+mobile&image_type=photo&pretty=true
  //
  // const relevant_Images: {
  //   [key: string]: string;
  // } = {};
  // const getImages = async (keywords: string) => {
  //   const config = {
  //     image_type: "photo",
  //     key: process.env.PIXABAY_API_KEY,
  //   };
  //   const url = `https://pixabay.com/api/?key=${config.key}&q=${keywords}&image_type=${config.image_type}&pretty=true`;
  //   const response = await axios.get(url);
  //   const images = response.data.hits
  //     .slice(0, 3)
  //     .map((image: any) => image.largeImageURL);
  //   relevant_Images[keywords] = images;
  // };

  // const keywordsArray = imagesKeywords.split(",");
  // for (const keyword of keywordsArray) {
  //   await getImages(keyword);
  // }

  //   restructuring the content with images
  //   const promptToMergeImages =
  //     content +
  //     " " +
  //     imagesCat +
  //     `I have the newsletter content ready and I have found relevant images to add to it. I would like you to merge the images with the content in a visually appealing way. Here's how I would like the images to be incorporated:
  // - Each image should be placed next to the corresponding section of text that it relates to.
  // - The images should be resized and aligned to fit the layout of the newsletter.
  // - Ensure that the images are high-quality and enhance the overall reading experience.
  // - Add captions or descriptions to the images if necessary to provide context.
  // - Maintain a consistent design style and color scheme throughout the newsletter.
  // `;

  //   const fullContent = await generateContent(promptToMergeImages);

  //   return fullContent;
  return { relevant_Images: [''], content };
};

// console.log("generateNewletterContent");
// const subtitles = `Zakir Khan's Storytelling Tips: A Detailed Summary
// This video, featuring Zakir Khan, delves into the art of storytelling, highlighting key points for becoming a better storyteller. Here's a detailed summary:

// 1. The Importance of Listening:

// Active Listening: Develop an eagerness to listen to others' stories, paying close attention to details and actively engaging in their narratives.
// Observing the Narrator: Observe the narrator's tone, emphasis, and style while listening, noting how they deliver their stories and what makes them compelling.
// 2. Cultivating the Habit of Storytelling:

// Note Down Stories: Maintain a list of 10 captivating stories that you find enjoyable to share.
// Practice Storytelling: Practice telling these stories regularly, even if it feels awkward at first. It's crucial to break free from self-consciousness and simply start sharing.
// Embrace Failure: View early attempts at storytelling as valuable learning experiences, akin to "failure deposits" that will ultimately lead to success.
// 3. Personalizing Your Stories:

// Incorporate Your Perspective: While sharing stories you've heard, inject your personal perspective and experiences, making the narrative resonate more deeply with listeners.
// Recount Your Own Experiences: Prioritize sharing stories from your own life, as they inherently hold more personal connection and authenticity.
// 4. The Power of Storytelling:

// Storytelling as a Universal Language: Stories transcend cultural and financial barriers, connecting people on a fundamental human level.
// Storytelling's Emotional Impact: Stories have the power to evoke a wide range of emotions in listeners, from laughter and joy to sadness and empathy.
// Storytelling in Everyday Life: Storytelling is not limited to professional settings; it's a vital tool for enhancing communication in various aspects of life, including teaching, sales, and personal relationships.
// 5. Mastering the Craft:

// Storytelling Techniques: Explore various storytelling techniques, such as using vivid language, incorporating sensory details, and creating tension and suspense.
// Story Structure: Understand the elements of a good story, including a clear beginning, rising action, climax, falling action, and resolution.
// The Impact of Setting: Recognize the importance of setting, which can greatly influence the story's atmosphere and emotional impact.
// 6. The Role of Emotion:

// Connect with the Audience's Emotions: Focus on evoking specific emotions in your listeners, whether it's joy, sadness, fear, or anger.
// The Universality of Human Emotion: Emphasize the universal nature of human emotions, allowing audiences to connect with your stories on a deeper level.
// 7. Practice and Refinement:

// Continual Practice: Storytelling is a skill that requires constant practice and refinement. Regularly telling stories helps improve delivery, timing, and impact.
// Experimenting with Stories: Experiment with telling different types of stories to discover what resonates with various audiences.
// 8. The Importance of Authenticity:

// Honesty in Storytelling: Share your stories honestly and authentically, revealing your true thoughts and feelings.
// Confidence in Your Voice: Trust in your unique voice as a storyteller, embracing your individual style and perspective.
// 9. The Power of Persuasion:

// Building Trust and Credibility: Effective storytelling builds trust and credibility, allowing you to connect with audiences and persuade them.
// Storytelling in Different Contexts: Storytelling is a valuable tool for persuasion in various contexts, from the classroom to the boardroom.
// 10. Embrace the Journey:

// Continuous Growth: Storytelling is a continuous journey of learning and improvement.
// Don't Be Afraid to Experiment: Try different approaches, learn from your experiences, and strive to continually grow as a storyteller.`;
// generateNewletterContent(subtitles).then(console.log).catch(console.error);
