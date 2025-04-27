import { CONFIG } from '@common';
const ImageKit = require('imagekit');
const myImagekit = new ImageKit({
  publicKey: CONFIG.IMAGE_KIT_PUBLIC_KEY,
  privateKey: CONFIG.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: 'https://ik.imagekit.io/soobati/',
});

export { myImagekit };
