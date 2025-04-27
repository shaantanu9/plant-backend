// import cron from "node-cron";

// export const scheduleJob = (
//   delay: number,
//   jobFunction: (data: any) => void,
//   data: any,
//   isPromise: boolean = false
// ) => {
//   const scheduledTime = new Date(Date.now() + delay);
//   const cronTime = `${scheduledTime.getUTCMinutes()} ${scheduledTime.getUTCHours()} ${scheduledTime.getUTCDate()} ${
//     scheduledTime.getUTCMonth() + 1
//   } *`;

//   cron.schedule(
//     cronTime,
//     async () => {
//       if (isPromise) {
//         try {
//           await jobFunction(data);
//         } catch (error) {
//           console.log(error);
//         }
//       } else {
//         jobFunction(data);
//       }
//     },
//     {
//       scheduled: true,
//       timezone: "UTC",
//     }
//   );

//   console.log(`Scheduled job for ${scheduledTime.toISOString()}`);
// };

import cron from 'node-cron';

export const scheduleJob = (
  delaySecond: number,
  jobFunction: (data: any) => void,
  data: any,
  isPromise: boolean = false,
) => {
  const delay = 1000 * delaySecond;
  if (delay < 60000) {
    // If delay is less than a minute, use setTimeout
    setTimeout(async () => {
      if (isPromise) {
        try {
          await jobFunction(data);
        } catch (error) {
          console.log(error);
        }
      } else {
        jobFunction(data);
      }
    }, delay);
    console.log(`Scheduled job to run after ${delay} milliseconds`);
  } else {
    // If delay is more than a minute, use node-cron
    const scheduledTime = new Date(Date.now() + delay);
    const cronTime = `${scheduledTime.getUTCMinutes()} ${scheduledTime.getUTCHours()} ${scheduledTime.getUTCDate()} ${
      scheduledTime.getUTCMonth() + 1
    } *`;

    cron.schedule(
      cronTime,
      async () => {
        if (isPromise) {
          try {
            await jobFunction(data);
          } catch (error) {
            console.log(error);
          }
        } else {
          jobFunction(data);
        }
      },
      {
        scheduled: true,
        timezone: 'UTC',
      },
    );

    console.log(`Scheduled job for ${scheduledTime.toISOString()}`);
  }
};
