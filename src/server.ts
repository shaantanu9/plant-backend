import App from './app';
import { CONFIG } from './common/config.common';
// // const SOCKET = require("socket.io");

// console.log("Running server.ts");

// // App.instance.listen(CONFIG.PORT, '0.0.0.0', () => {
// // App.instance.listen(CONFIG.PORT, () => {
// //   console.log(`Server running in ${CONFIG.NODE_ENV} mode`);
// //   console.log(`Server started on port ${CONFIG.PORT}`);
// // });

// App.server.listen(CONFIG.PORT, () => {
//   console.log(`Socket server started on port 8088`);
// });

App.server.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${CONFIG.PORT}`);
});

// import './cluster';

// console.log("Running server.ts");
