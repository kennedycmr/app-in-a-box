//==========================================================================
//   Function: Compound Query
//   Description: Perform a compound query on a Firestore collection (always returns a promise)
//   Documentation:
//   - https://firebase.google.com/docs/firestore/query-data/queries
//   - https://cloud.google.com/firestore/docs/samples/firestore-query-collection-group-filter-eq#firestore_query_collection_group_filter_eq-nodejs
//==========================================================================

//   Example - How to use this function: 
//
//   var queries = [
//       ["requester", "==", getContextUser.emailaddress],
//       ["locationid", "==", document.locationid],
//       ["day", "==", document.day],
//       ["month", "==", document.month],
//       ["year", "==", document.year]
//     ]
//     
//    //Check for duplicate bookings
//    CompoundQuery("bookings", queries)
//    //Success > Submit form
//    .then((results) => {
//  
//      //If duplicate booking exists > prevent form submission
//      if(results.length > 0){
//        setBookingSubmitted(false)
//        preventSubmit = true;
//  
//      } else{
//        setBookingSubmitted(true)
//      }
//  
//      //If duplicate booking does NOT exist > submit form and write to Firestore
//      if(preventSubmit === false) {
//  
//        WriteDocument('bookings', bookingId, document, true)
//        //If success > show thank you message
//        .then((results) =>{
//          setFormStatus('success')
//  
//        })
//        //If function failed > Log error and set page to 'failed'
//        .catch((error) =>{
//          setRequestType('failed')
//        })
//         
//      }
//    })
//    //Error > Show error page
//    .catch((error) =>{
//      setRequestType('failed')
//    })

//------------------------------------------------------

//Libraries
import { initializeApp  } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from './FirebaseConfig';
import { getDocs, collection, query, where } from "firebase/firestore";

export default async function CompoundQuery(collectionId, queries){

  //------------------------------------------------------
  //  Execute query
  //------------------------------------------------------

    try {

      //Firestore database reference
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      
      //Set collection
      const collectionRef = collection(db, collectionId);

      //Temp array used to store query arguments
      var args = []

      //Extract list of queries from array
      queries.forEach((query) => {
        const arg = where(query[0], query[1], query[2])
        args.push(arg)
      })

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
      throw new Error(`ERROR: Function QueryDocument failed to complete, error ${error}`)
    }

  //------------------------------------------------------
}