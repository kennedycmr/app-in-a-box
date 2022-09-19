// ---------------------------------------------
//  GetDocument - Generic way to get a Firestore Document
//    Always returns a 'promise'
//    https://cloud.google.com/firestore/docs/samples/firestore-data-set-doc-upsert#firestore_data_set_doc_upsert-nodejs
// ---------------------------------------------

// Libraries
const admin = require('firebase-admin');

module.exports = async function GetDocument(collection, documentId) {

  // Firestore Client
  const db = admin.firestore();

  // Get document
  const documentRef = db.collection(collection).doc(documentId);

  // Handle response
  const doc = await documentRef.get();
  if (!doc.exists) {

    throw new Error(`No document exists!`);

  } else {

    return doc.data();

  }

};
