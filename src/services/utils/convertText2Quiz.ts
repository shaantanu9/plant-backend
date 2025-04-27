// // export const parseQuestions = (text: string): any[] => {
// //     const questions: any[] = [];
// //     const questionBlocks = text.split("**Question ").slice(1); // Split by question blocks and remove the first empty element

// //     questionBlocks.forEach((block) => {
// //       const [questionPart, optionsPart, answerPart] = block.split("**");

// //       const questionMatch = questionPart.match(/: (.+?)\n/);
// //       const question = questionMatch ? questionMatch[1].trim() : "";

// //       const optionsMatch = optionsPart.match(/Options:\n([\s\S]+?)\n\n/);
// //       const options = optionsMatch ? optionsMatch[1].trim().split("\n").map(opt => opt.trim().replace(/^\d+\. /, "")) : [];

// //       const correctAnswerMatch = answerPart.match(/Correct Answer:\s*(\d)/);
// //       const correctAnswer = correctAnswerMatch ? parseInt(correctAnswerMatch[1], 10) : 0;

// //       if (question && options.length > 0 && correctAnswer) {
// //         questions.push({
// //           question,
// //           options,
// //           correctAnswer,
// //         });
// //       }
// //     });

// //     return questions;
// //   };

// const parseQuestions = (text) => {
//   const questions = [];
//   const questionBlocks = text.split("**Question ").slice(1); // Split by question blocks and remove the first empty element

//   questionBlocks.forEach((block) => {
//     const splitData = block.split("**");
//     const questionPart = splitData[1];
//     const optionsPart = splitData[3];
//     const answerPart = splitData[5];

//     const questionMatch = questionPart.match(/: (.+?)\n/);
//     const question = questionMatch ? questionMatch[1].trim() : "";

//     const optionsMatch = optionsPart.match(/\n([\s\S]+?)\n\n/);
//     const options = optionsMatch ? optionsMatch[1].trim().split("\n").map(opt => opt.trim().replace(/^\d+\. /, "")) : [];

//     const correctAnswerMatch = answerPart.match(/\s*(\d)/);
//     const correctAnswer = correctAnswerMatch ? options[parseInt(correctAnswerMatch[1], 10) - 1] : "";

//     if (question && options.length > 0 && correctAnswer) {
//       questions.push({
//         question,
//         options,
//         correctAnswer,
//       });
//     }
//   });

//   return questions;
// };

// const text = `**Question 1:**  According to the video, what is the most important factor in defining your value proposition?

// **Options:**

// 1.  Creating a catchy slogan.
// 2.  Identifying your target audience and their problems.
// 3.  Offering the lowest price in the market.
// 4.  Having a fancy website and marketing materials.

// **Correct Answer:** 2

// **Question 2:**  What does "Minimum Viable Segment" refer to in the context of defining your value proposition?

// **Options:**

// 1.  The smallest possible market segment that can sustain your business.
// 2.  The group of people who are most likely to buy your product.
// 3.  The group of people who are most likely to give you negative feedback.
// 4.  The largest market segment that you can potentially reach.

// **Correct Answer:** 1

// **Question 3:**  Which framework is suggested for determining the value proposition based on the problem or need you address?

// **Options:**

// 1.  SWOT Analysis
// 2.  Porter's Five Forces
// 3.  "Unworkable, unavoidable, urgent, underserved" or "latent need evolving to blatant need"
// 4.  Pareto Principle (80/20 Rule)

// **Correct Answer:** 3

// **Question 4:**  Why is it crucial to validate your value proposition with potential customers?

// **Options:**

// 1.  To ensure your product is legally compliant.
// 2.  To get their opinions on your product's design.
// 3.  To understand their pain points, priorities, and motivations.
// 4.  To get early adopters and generate buzz.

// **Correct Answer:** 3

// **Question 5:**  What does the "Gain-Pain Ratio" refer to when evaluating your value proposition?

// **Options:**

// 1.  The cost of manufacturing your product vs. the selling price.
// 2.  The benefits your product provides compared to the challenges of adopting it.
// 3.  The amount of time it takes to develop your product vs. its potential lifespan.
// 4.  The number of positive reviews your product receives vs. negative reviews.

// **Correct Answer:** 2

// **Question 6:**  What does a "3D breakthrough" in your value proposition entail?

// **Options:**

// 1.  Being faster, better, and cheaper than competitors.
// 2.  Offering a product with three different functionalities.
// 3.  Creating something disruptive, discontinuous, and defensible.
// 4.  Focusing on a specific niche market with high demand.

// **Correct Answer:** 3

// **Question 7:**  What is one way to create a "disruptive" value proposition?

// **Options:**

// 1.  Introducing a new technology or business model.
// 2.  Offering a premium product at a higher price.
// 3.  Creating a product that is visually appealing.
// 4.  Focusing on a specific geographical market.

// **Correct Answer:** 1

// **Question 8:**  Why is it important to identify dependencies for your product's success?

// **Options:**

// 1.  To ensure your product integrates seamlessly with other platforms.
// 2.  To understand the potential risks and challenges you might face.
// 3.  To avoid legal issues related to intellectual property.
// 4.  To create a comprehensive marketing strategy.

// **Correct Answer:** 2

// **Question 9:**  What is the most crucial element of a strong value proposition statement?

// **Options:**

// 1.  A catchy slogan that grabs attention.
// 2.  A detailed explanation of your product's features.
// 3.  A clear description of the problem your product solves and the benefits it provides.
// 4.  A guarantee of customer satisfaction.

// **Correct Answer:** 3

// **Question 10:**  According to the video, what is the ultimate goal of creating a strong value proposition?

// **Options:**

// 1.  To become the market leader in your industry.
// 2.  To create a product that people will actually buy and use.
// 3.  To attract venture capitalists and secure funding.
// 4.  To win industry awards and recognition.

// **Correct Answer:** 2 `;

export function parseQuestions(text: string) {
  const splitText = text.split('**Question');
  const questions = [];
  // console.log(questions);

  for (let i = 1; i < splitText.length; i++) {
    const question1 = splitText[i];
    //   console.log(question1);

    const question1Parts = question1.split('**Options:');
    //   console.log(question1Parts);

    const question1Text = question1Parts[0].trim().split('**')[1].trim();
    //   console.log(question1Text);

    const question1Options = question1Parts[1].split('**Correct Answer:');
    //   console.log(question1Options);

    const question1OptionsText = question1Options[0].trim();
    //   console.log(question1OptionsText);

    const question1CorrectAnswer = question1Options[1].trim().split('**')[1].trim();
    //   console.log(question1CorrectAnswer);

    const question1OptionsList = question1OptionsText.split('\n');
    //   console.log(question1OptionsList);

    const question1OptionsListFiltered = question1OptionsList.filter(
      (option: any) => option.trim().length > 0,
    );
    //   console.log(question1OptionsListFiltered);

    const question1OptionsListFormatted = question1OptionsListFiltered.map((option: any) =>
      option.trim().replace(/\d+\.\s+/, ''),
    );
    //   console.log({
    //     question1OptionsListFormatted,
    //     length: question1OptionsListFormatted.length,
    //   });

    if (question1OptionsListFormatted.length !== 4) {
      // console.log("Error: Less than 4 options");
      if (question1OptionsListFormatted[0] == '**') {
        question1OptionsListFormatted.shift();
      }
    }

    const question1Object = {
      question: question1Text,
      options: question1OptionsListFormatted,
      correctAnswer: question1OptionsListFormatted[parseInt(question1CorrectAnswer) - 1],
    };

    // console.log(question1Object);
    questions.push(question1Object);
  }
  return questions;
}
