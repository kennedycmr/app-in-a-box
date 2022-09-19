//==========================================================================
//   Function: Get Document
//   Description: Returns a document from a collection
//   Use Case: Use this function when you are sure the document exists in the collection
//   Documentation:
//   - https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
//==========================================================================

//   Example - How to use this function: 
//
//   GetDocument("knowledgebase/confluence/labels", selectedCategory)
//   .then((results) =>{

//     //Convert response to an array
//     var articles = [[results][0]]
//     articles = [].concat(...articles.map(Object.values));

//     //Update list of knowledge articles displayed to the user
//     setKnowledgeArticles(articles)

//     //Change pageStatus > 'success'
//     setPageStatus('success')

//   }).catch((error) => {
//       console.log("Knowledge Hub - Failed to fetch records. Error: ", error)
//   })

//------------------------------------------------------

//Libraries
import { initializeApp  } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {firebaseConfig} from './FirebaseConfig';
import { doc, getDoc } from "firebase/firestore";

export default async function GetDocument(collectionId, documentId){

  //------------------------------------------------------
  //  Execute query
  //------------------------------------------------------

    try {

      //Firestore Client
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      //Get Document
      const docRef = doc(db, collectionId, documentId);
      const docSnap = await getDoc(docRef);

      //Handle Response
      if (docSnap.exists()) {
        return docSnap.data();

      } else {
        throw new Error(`Document '${documentId}' does not exist`);
      }


    } catch (error) {
      throw new Error(`Function GetDocument failed to complete, error ${error}`)

    }

  //------------------------------------------------------
}