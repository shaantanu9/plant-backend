// import * as fs from "fs"
// import * as handlebar from "handlebars"
// export const TEMPLATER = {
//     makeHtmlTemplate: async function (source: any, data: any) {
//         return new Promise((resolve, reject) => {
//             fs.readFile(source, 'utf8', (err, content) => {
//                 if (err) {
//                     console.log('Error in side makeHtmlTemplate', err);
//                     reject(err);
//                 }
//                 try {
//                     let template = handlebar.compile(content, { noEscape: true });
//                     let html = template(data);
//                     resolve(html);
//                 } catch (error) {
//                     console.error(`we got error in compiling html`, error);
//                     reject(error);
//                 }
//             });
//         });
//     }
// }
