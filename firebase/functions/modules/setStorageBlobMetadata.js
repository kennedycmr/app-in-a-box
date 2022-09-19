// ---------------------------------------------
//  setStorageBlobMetadata - Generic way to update a files metadata
//    Always returns a 'promise'
//    https://cloud.google.com/storage/docs/viewing-editing-metadata#storage-view-object-metadata-nodejs
//
//    How to use:
//      setStorageBlobMetadata(bucketName, fileName, metaData).catch((error) =>{
//
//        console.log('error', error);
//
//      })
//
// ---------------------------------------------

// Libraries
const {Storage} = require('@google-cloud/storage');

module.exports = async function setStorageBlobMetadata(fileName, metaData) {

  try {

    // Get bucket
    const storageBucket = JSON.parse(process.env.FIREBASE_CONFIG).storageBucket;

    // Creates a client
    const storage = new Storage();
    await storage.bucket(storageBucket).file(fileName).setMetadata(metaData);

  } catch (error) {

    throw new Error(`Failed to update metadata for ${fileName}, error ${error}`);

  }

};
