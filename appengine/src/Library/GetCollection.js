//==========================================================================
//   Function: Get Collection
//   Description: Gets all documents in a Firestore Collection (always returns a promise)
//   Documentation:
//   - https://firebase.google.com/docs/firestore/query-data/get-data
//==========================================================================

//   Example - How to use this function: 
//
//   GetCollection("locations")
//   .then((results) =>{
//      setLocations(results)
//      setRequestType("onload"   
//    })
//    .catch((error) =>{
//      setRequestType('failed')
//    })

//==========================================================================

//Libraries
import { initializeApp  } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {firebaseConfig} from './FirebaseConfig';
import { collection, getDocs } from "firebase/firestore";


export default async function GetCollection(collectionId){

  //------------------------------------------------------
  //  Get all documents
  //------------------------------------------------------

    try {

      //Firestore database reference
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      //Store all documents in an array
      var results = []
      const response = await getDocs(collection(db, collectionId));

      response.forEach(document => {
          var documentObject = document.data();
          results.push(documentObject)
      })
      
      return results

    } catch (error) {
      throw new Error(`Function GetCollection failed to complete, error ${error}`)
    
    }

  //------------------------------------------------------
}