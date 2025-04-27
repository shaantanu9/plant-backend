import { generateContent } from './gemeniModel';

export const generateTwitterThreads = async (summary: string, link: any) => {
  const generateTwitterThreadsPrompt = `this is ${summary} and this is ${link} Create a multi-part Twitter thread that summarizes and expands on the key insights from [insert video title or topic]. The thread should be engaging, informative, and encourage discussion among your followers.
  Include the following elements for each tweet in the thread:
  Attention-Grabbing Opening Line: Start each tweet with a compelling statement or question that hooks the reader's interest related to the video topic.
  Key Insight or Takeaway: Present a key point or insight from the video summary. Make it clear and concise, ensuring it adds value to the reader.
  Supporting Details: Provide a brief explanation or example that elaborates on the key insight. This could be a statistic, a personal anecdote, or a relevant quote.
  Call to Action: Encourage readers to engage by asking a question or prompting them to share their thoughts on the topic.
  Relevant Hashtags: Include 1-2 relevant hashtags at the end of each tweet to increase visibility and reach.
  This is just a example you can do more and can add more tweets to the thread. and any structure you want to follow.
  Example Structure for Each Tweet in the Thread:
  Tweet 1:
  Opening Line: "Ever wondered how [insert intriguing question related to the video topic]?"
  Key Insight: "In our latest video, we discuss [insert key insight]."
  Supporting Details: "This is crucial because [insert brief explanation or example]."
  Call to Action: "What are your thoughts on this? Let's discuss!"
  Hashtags: #YourIndustry #VideoSummary #Engagement #Learning
  Tweet 2:
  Opening Line: "Did you know that [insert surprising fact or statistic]?"
  Key Insight: "Another important takeaway is [insert next key insight]."
  Supporting Details: "This highlights the need for [insert explanation or anecdote]."
  Call to Action: "Have you experienced this in your career? Share your story!"
  Hashtags: #YourIndustry #ProfessionalGrowth #Insights
  Tweet 3:
  Opening Line: "What if you could [insert aspirational statement]?"
  Key Insight: "One more vital point from the video is [insert final key insight]."
  Supporting Details: "Implementing this can lead to [insert benefits or outcomes]."
  Call to Action: "What strategies do you use to achieve this? Let's learn from each other!"
  Hashtags: #YourIndustry #CareerAdvice #Networking
  Key Considerations:
  Cohesive Narrative: Ensure that each tweet in the thread flows logically from one to the next, creating a cohesive narrative that keeps readers engaged.
  Brevity and Clarity: Each tweet should be concise and focused, making it easy for readers to digest the information quickly.
  Engagement Focus: Use open-ended questions to foster discussion and encourage readers to share their experiences and insights.
    `;

  const twitterThreads = await generateContent(generateTwitterThreadsPrompt);

  return twitterThreads;
};
