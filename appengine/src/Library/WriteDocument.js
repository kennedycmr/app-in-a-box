//==========================================================================
//   Function: Write Document
//   Description: Creates/Writes a Firestore document (always returns a promise)
//   Documentation:
//   - https://cloud.google.com/community/tutorials/cloud-functions-firestore
//   - https://cloud.google.com/firestore/docs/samples/firestore-data-set-doc-upsert#firestore_data_set_doc_upsert-nodejs
//   - https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
//==========================================================================

//   Example - How to use this function: 
//
//    WriteDocument('users', emailaddress, document, true)
//    .then((results) =>{
//      console.log("results", results)
//    })
//    .catch((error) =>{
//      console.log("error", error)
//      setRequestType('failed')
//      setAdminError(`WriteDocument failed in Users.js, error ${error}`)
//      setUserError("Failed to update user, please try again and if the issue persists contact your Adminstrator.")
//    })

//==========================================================================

//Libraries
import { initializeApp  } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {firebaseConfig} from './FirebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 


export default async function WriteDocument(collectionId, documentId, documentObject, mergeDocument){

  //------------------------------------------------------
  //  Update one document with an object 
  //------------------------------------------------------

    //Update existing document
    try {

      //Firestore Database reference
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      //Set collection
      const collectionDocRef = doc(db, collectionId, documentId);

      //Write to document
      await setDoc(collectionDocRef, documentObject, { merge: mergeDocument });

      return "success"
      

    } catch (error) {
      throw new Error(`Function WriteDocument failed to complete, error ${error}`)
    }

  //------------------------------------------------------
}