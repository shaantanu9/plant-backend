import { generateContent } from './gemeniModel';

export const generateLinkedinPost = async (summary: string, link: any) => {
  const linkedinPostPrompt = `this is ${summary} and this is youtube ${link} Create an engaging LinkedIn post that captures attention and encourages interaction. The post should focus on [insert specific topic or theme related to your industry or expertise].
    Include the following elements:
    A Compelling Hook: Start with a thought-provoking question or a bold statement that addresses a common challenge faced by professionals in [insert industry].
    Value Proposition: Clearly outline the benefits or insights the audience will gain from reading the post. Highlight how this information can help them overcome challenges or achieve their goals.
    Personal Anecdote or Insight: Share a brief personal story or experience related to the topic that adds authenticity and relatability. This will help to build a connection with your audience.
    Key Takeaways: Summarize 2-3 actionable tips or insights that readers can implement immediately. Use bullet points for clarity.
    Call to Action: Encourage readers to engage by asking a question or inviting them to share their thoughts or experiences in the comments.
    Relevant Hashtags: Include 3-5 hashtags relevant to the topic to increase visibility and reach.
    
    Key Considerations:
Audience Awareness: Tailor the content to resonate with your specific audience, considering their interests and challenges.
Authenticity: Personal stories enhance relatability and trust, making your post more engaging.
Clarity and Brevity: Keep the post concise while ensuring it delivers value, as LinkedIn users often skim through content.

    `;

  const linkedinPost = await generateContent(linkedinPostPrompt);

  return linkedinPost;
};
