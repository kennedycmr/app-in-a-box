// ---------------------------------------------
//  Move Object - Generic way to delete a file from GCS
//    Always returns a 'promise'
//    https://cloud.google.com/storage/docs/deleting-objects?hl=en#prereq-code-samples
//
//  example:
//
//  return deleteObject(srcfilePathName).then(() =>{
//
//    return 'success';
//
//  });
//
// ---------------------------------------------

// Libraries
const {Storage} = require('@google-cloud/storage');

module.exports = async function DeleteObject(srcfilePathName) {

  try {

    // Get bucket
    const storageBucket = JSON.parse(process.env.FIREBASE_CONFIG).storageBucket;

    // Creates a client
    const storage = new Storage();

    await storage.bucket(storageBucket).file(srcfilePathName).delete();

  } catch (error) {

    throw new Error(`Failed to rename or move object, error ${error}`);

  }

};
