// ---------------------------------------------
//  getStorageMetdata - Generic way to get a files metadata
//    Always returns a 'promise'
//    https://cloud.google.com/storage/docs/viewing-editing-metadata#view
//
//    How to use:
//      getStorageMetdata(fileName).then((metadata) =>{
//
//        console.log('metadata', metadata);
//
//      }).catch((error) =>{
//
//        console.log('error', error);
//
//      })
//
// ---------------------------------------------

// Libraries
const {Storage} = require('@google-cloud/storage');

module.exports = async function getStorageMetdata(fileName) {

  try {

    // Get bucket
    const storageBucket = JSON.parse(process.env.FIREBASE_CONFIG).storageBucket;

    // Creates a client
    const storage = new Storage();
    storage.bucket(storageBucket).file(fileName).getMetadata().then((metadata) =>{

      return metadata;

    }).catch((error) =>{

      throw new Error(`Failed to extract metadata for ${fileName}, error ${error}`);

    });

  } catch (error) {

    throw new Error(`Failed to extract metadata for ${fileName}, error ${error}`);

  }

};
