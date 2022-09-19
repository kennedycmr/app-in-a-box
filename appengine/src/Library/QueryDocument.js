//==========================================================================
//   Function: Query Document
//   Description: Perform a single query on a Firestore collection (always returns a promise)
//   Documentation:
//   - https://firebase.google.com/docs/firestore/query-data/queries
//   - https://cloud.google.com/firestore/docs/samples/firestore-query-collection-group-filter-eq#firestore_query_collection_group_filter_eq-nodejs
//==========================================================================

//   -----------------------------------
//   Function Parameters
//   
//   * collectionId - The name of the collection you want to query, "month"
//   * queries - The array of queries you want to perform against a collection (can be just one), e.g [["month", "==", "202202"]]
//   * sortBy <optional> - An array containing the field you want to order your query by and what order, e.g. ["month", "desc"]
//   * limitBy <optional> - The number of records you want to return, e.g. 2

//   -----------------------------------
//   Example - How to use this function: 
//
//   //Get all project level emissions
//   QueryDocument(`sustainability/${project}/months`, "", ["month_int", "desc"], 2)
//   .then((months) =>{
    
//     //Check if project has emissions > Extract values
//     if (months.length > 0){
  
//       //Extract latest month totals and trend
//       projectMetrics.latestMonthTotal = months[0].total_emissions  
//       projectMetrics.trend = months[0].trend  
  
//       //If previous month data exists > Extract previous month totals 
//       if(months.length > 1){
//         projectMetrics.previousMonthTotal = months[1].total_emissions
//       }
//     }
  
//   })
//   .catch((error) => {
//       console.log(error)
//       // SetAppErrors(error)
//       setSustainabilityQueryStatus('error-fatal')
//   })

//------------------------------------------------------

//Libraries
import { initializeApp  } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {firebaseConfig} from './FirebaseConfig';
import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";

export default async function QueryDocument(collectionId, queries, sortBy, limitBy){

  try {

    //Firestore database reference
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    //Set collection
    const collectionRef = collection(db, collectionId);

    //------------------------------------------------------
    //  Prepare query arguments 
    //------------------------------------------------------

    //Temp array used to store query arguments
    var args = []

    //Extract list of queries from array
    if(queries.length > 0){
      queries.forEach((query) => {
        const queryArg = where(query[0], query[1], query[2])
        args.push(queryArg)
      })
    }

    //Check if sortBy exists > add to query arguments
    if(sortBy?.length > 0) {
      const orderByArg = orderBy(sortBy[0], sortBy[1])
      args.push(orderByArg)
    }

    //Check if limitBy exists > add to query arguments
    if(limitBy) {
      const limitArg = limit(limitBy)
      args.push(limitArg)
    }

    //------------------------------------------------------
    //  Execute query 
    //------------------------------------------------------

    //Create query
    const q = query(collectionRef, ...args);

    //Temp array used to store results 
    var results = []

    //Execute query
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      results.push(doc.data());
    });

    return results

  } 
  catch (error) {
    throw new Error(`Function QueryDocument failed to complete, error ${error}`)
  }

  //------------------------------------------------------
}