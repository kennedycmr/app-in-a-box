// ---------------------------------------------
//  Move Object - Generic way to rename and move a file in GCS
//    Always returns a 'promise'
//    https://cloud.google.com/storage/docs/copying-renaming-moving-objects?hl=en#move
//
//  example:
//
//  return renameMoveObject(srcFilePath, srcfileName, `products/${productId}`, destFileName).then(() =>{
//
//    return 'success';
//
//  });
//
// ---------------------------------------------

// Libraries
const {Storage} = require('@google-cloud/storage');

module.exports = async function MoveRenameObject(srcFilePath, srcFileName, destFilePath, destFileName) {

  try {

    // Get bucket
    const storageBucket = JSON.parse(process.env.FIREBASE_CONFIG).storageBucket;

    // Creates a client
    const storage = new Storage();

    await storage.bucket(storageBucket).file(`${srcFilePath}/${srcFileName}`).move(`${destFilePath}/${srcFileName}`);
    await storage.bucket(storageBucket).file(`${destFilePath}/${srcFileName}`).rename(`${destFilePath}/${destFileName}`);

  } catch (error) {

    throw new Error(`Failed to rename or move object, error ${error}`);

  }

};
