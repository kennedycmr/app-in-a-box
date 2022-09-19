// ---------------------------------------------
//  getStorageBlob - Generic way to get a blob (into memory) from Cloud Storage
//    Always returns a 'promise'
//    https://cloud.google.com/storage/docs/downloading-objects#storage-download-object-nodejs
// ---------------------------------------------

// Libraries
const {Storage} = require('@google-cloud/storage');

module.exports = async function getStorageBlob(fileName) {

  try {

    // Get bucket
    const storageBucket = JSON.parse(process.env.FIREBASE_CONFIG).storageBucket;

    // Creates a client
    const storage = new Storage();

    // Downloads the file into a buffer in memory.
    const contents = await storage.bucket(storageBucket).file(fileName).download();

    // Return content as string
    return contents.toString();

  } catch (error) {

    throw new Error(`Failed to download contents, error ${error}`);

  }

};
