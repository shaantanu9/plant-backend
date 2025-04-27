import { v2 } from '@google-cloud/translate';

// Creates a client
const translate = new v2.Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  const [translation] = await translate.translate(text, targetLang);
  return translation;
};

export const translateQuestionsArray = async (questionsArray: any, targetLang: any) => {
  // Iterate through each question object
  const translatedQuestions = await Promise.all(
    questionsArray.map(async (questionObj: any) => {
      // Translate each part of the question object
      const translatedQuestion = await translateText(questionObj.question, targetLang);
      const translatedCorrectAnswer = await translateText(questionObj.correctAnswer, targetLang);

      // Translate options if they exist
      const translatedOptions = await Promise.all(
        questionObj.options.map(async (option: any) => {
          return await translateText(option, targetLang);
        }),
      );

      // Return the translated question object
      return {
        ...questionObj,
        question: translatedQuestion,
        correctAnswer: translatedCorrectAnswer,
        options: translatedOptions,
      };
    }),
  );

  return translatedQuestions;
};

// const GOOGLE_TRANSLATE_API_KEY="AIzaSyBDtmwhBayV2150rQTiiTluYwDGZYv5VZQ"

// const translate = require('@google-cloud/translate').v2.Translate({key:GOOGLE_TRANSLATE_API_KEY})

// export const translateText = async (text: string, targetLang: string): Promise<string> => {
//   const [translation] = await translate.translate(text, targetLang);
//   return translation;
// };

// translateText("Hello World", "hi").then(console.log)
