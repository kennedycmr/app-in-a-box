// ---------------------------------------------
//  WriteDocument - Generic way to update a Firestore Document
//    Always returns a 'promise'
//    https://cloud.google.com/community/tutorials/cloud-functions-firestore
//    https://cloud.google.com/firestore/docs/samples/firestore-data-set-doc-upsert#firestore_data_set_doc_upsert-nodejs
//
//  Example:
//    writeDocument('users', emailAddress, document, false).then((results) =>{
//
//      console.log('results', results);
//
//    }).catch((error) =>{
//
//      console.log('error', error);
//
//    });
// ---------------------------------------------

// Libraries
const admin = require('firebase-admin');

module.exports = async function WriteDocument(collection, documentId, object, mergeDocument) {

  // Update existing document
  try {

    // Firestore Client
    const db = admin.firestore();

    // Write to document
    const documentRef = db.collection(collection).doc(documentId);
    return documentRef.set(object, {

      merge: mergeDocument,

    }).then(()=>{

      return;

    }).catch((error) =>{

      throw new Error(`Function WriteDocument failed to complete, error ${error}`);

    });

  } catch (error) {

    throw new Error(`Function WriteDocument failed to complete, error ${error}`);

  }

};
