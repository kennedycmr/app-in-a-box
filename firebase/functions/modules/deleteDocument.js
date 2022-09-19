// ---------------------------------------------
//  QueryDocument - Generic way to delete a document from Firestore
//    Always returns a 'promise'
//    https://cloud.google.com/firestore/docs/samples/firestore-data-delete-doc
// ---------------------------------------------

// Libraries
const admin = require('firebase-admin');

module.exports = async function DeleteDocument(collectionId, documentId) {

  // ---------------------------------------------
  //  Function Variables
  // ---------------------------------------------

  // Firestore Client
  const db = admin.firestore();

  // ---------------------------------------------
  //  Delete document
  // ---------------------------------------------

  try {

    await db.collection(collectionId).doc(documentId).delete();
    return {
      'status': 'success',
      'message': 'Deleted document',
    };

  } catch (error) {

    return {
      'status': 'failed',
      'message': 'query has failed with error', error,
    };

  }

};
