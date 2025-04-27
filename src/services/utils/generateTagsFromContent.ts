import { generateContent } from './gemeniModel';

export const generateTagsFromContent = async (content: string) => {
  const prompt = `Analyze the following content and generate a list of relevant tags that best describe the main topics and themes:

    Content:
    ${content}
  
    only give the tags as a comma-separated list, e.g. "tag1, tag2, tag3"`;

  const generatedContent = await generateContent(prompt);

  const tagArray = generatedContent.split(',').map((tag: string) => tag.trim());

  console.log({ tagArray }, 'before ');

  // filter out empty tags
  const filteredTags = tagArray.filter((tag: string) => tag.length > 0);

  return filteredTags;
};
