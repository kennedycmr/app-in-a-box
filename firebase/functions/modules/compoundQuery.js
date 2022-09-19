// ---------------------------------------------
//  CompoundQuery - Generic way to query a Firestore Document
//    Always returns a 'promise'
//    https://cloud.google.com/firestore/docs/samples/firestore-query-collection-group-filter-eq#firestore_query_collection_group_filter_eq-nodejs
//
//  CompoundQuery:
//   CompoundQuery('users', 'emailaddress', '==', 'some.one@whocares.com', 'status', '==', 'active').then((results) =>{
//     console.log('document', results)
//   })
// ---------------------------------------------

// Libraries
const admin = require('firebase-admin');

module.exports = async function CompoundQuery(collection, q1, q2, q3, q4, q5, q6) {

  try {

    // Firestore Client
    const db = admin.firestore();

    // Query document
    const results = [];
    const querySnapshot = await db.collection(collection).where(q1, q2, q3).where(q4, q5, q6).get();
    querySnapshot.forEach((doc) => {

      results.push(doc.data());

    });

    return results;

  } catch (error) {

    throw new Error(`Function queryDocument failed to complete, error ${error}`);

  }

};
