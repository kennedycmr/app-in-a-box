// ---------------------------------------------
//  QueryDocument - Generic way to update a Firestore Document
//    Always returns a 'promise'
//    https://firebase.google.com/docs/firestore/query-data/queries
//
//  Example:
//    const queries = [
//      ['status', '==', 'active'],
//      ['email', '==', 'some.one@whocares.com'],
//    ]
//    queryDocument(collectionId, queries).then((results) =>{
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
const {getFirestore} = require('firebase-admin/firestore');

module.exports = async function QueryDocument(collectionId, queries) {

  try {

    // Firestore Client
    const db = getFirestore();

    // Set collection & define variable for query
    const collectionRef = db.collection(collectionId);
    let collectionQuery;

    // Extract list of queries from array
    // Benno 08/06/2022 - I couldn't find a way to append the collectionRef's object, so limited this query to a maxium of three
    if (queries.length > 0) {

      if (queries.length === 1) {

        const queryOne = queries[0];
        collectionQuery = collectionRef.where(queryOne[0], queryOne[1], queryOne[2]);

      } else if (queries.length === 2) {

        const queryOne = queries[0];
        const queryTwo = queries[1];
        collectionQuery = collectionRef.where(queryOne[0], queryOne[1], queryOne[2]).where(queryTwo[0], queryTwo[1], queryTwo[2]);

      } else if (queries.length === 3) {

        const queryOne = queries[0];
        const queryTwo = queries[1];
        const queryThree = queries[2];
        collectionQuery = collectionRef.where(queryOne[0], queryOne[1], queryOne[2]).where(queryTwo[0], queryTwo[1], queryTwo[2]).where(queryThree[0], queryThree[1], queryThree[2]);

      } else {

        throw new Error(`Function QueryDocument only supports three queries!`);

      }

    } else {

      throw new Error(`Function QueryDocument query is undefined!`);

    }

    // Execute query
    return collectionQuery.get().then((querySnapshot) =>{

      const results = [];

      querySnapshot.forEach((doc) => {

        // doc.data() is never undefined for query doc snapshots
        return results.push(doc.data());

      });

      return results;

    }).catch((error) =>{

      throw new Error(`Function QueryDocument failed to complete, error ${error}`);

    });

  } catch (error) {

    throw new Error(`Function QueryDocument failed to complete, error ${error}`);

  }

};
