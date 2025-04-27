// import cluster from 'cluster';
// import os from 'os';
// import App from './app';
// import { CONFIG } from './common/config.common';

// const numCPUs = os.cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork(); // Optionally restart the worker
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);
//   App.server.listen(CONFIG.PORT, () => {
//     console.log(`Server running on port ${CONFIG.PORT}`);
//   });
// }

// // Bleow is without Socket.IO

// // import cluster from 'cluster';
// // import os from 'os';
// // import App from './app';
// // import { CONFIG } from './common/config.common';

// // const numCPUs = os.cpus().length;

// // if (cluster.isMaster) {
// //   console.log(`Master ${process.pid} is running`);

// //   // Fork workers
// //   for (let i = 0; i < numCPUs; i++) {
// //     cluster.fork();
// //   }

// //   cluster.on('exit', (worker, code, signal) => {
// //     console.log(`Worker ${worker.process.pid} died`);
// //     cluster.fork(); // Optionally restart the worker
// //   });
// // } else {
// //   console.log(`Worker ${process.pid} started`);
// //   App.instance.listen(CONFIG.PORT, () => {
// //     console.log(`Server running on port ${CONFIG.PORT}`);
// //   });
// // }
