//==========================================================================
//   Function: DownloadFile
//   Description: Generic function to get a Firestore Collection
//   Documentation:
//   - https://firebase.google.com/docs/storage/web/start
//==========================================================================

//   -----------------------------------
//   Function Parameters
//   
//    filepath = The path to the file you would like to download, this includes the name and format!

//   -----------------------------------

//   Example - How to use this function:
//    * If you need another example, check out the 'Upload' component

//   DownloadFile('images/rads_legend.png').then((results) =>{
//     console.log('results', results)
//   }).catch((error) =>{
//     console.log('error', error)
//   })

//------------------------------------------------------

//Libraries
import { getStorage, ref, getDownloadURL } from "firebase/storage";


export default async function DownloadFile(path){

  //------------------------------------------------------
  //  Get Collection
  //------------------------------------------------------

    try {

      // Create a root reference
      const storage = getStorage();
     
      // Create a reference to 'file' we want to download
      // 'images/figma.png'
      const storageRef = ref(storage, path);

      // Get download url for file
      return getDownloadURL(storageRef).then((results) =>{
        return results;
      })

    } catch (error) {
      throw new Error(`Function DownloadFile failed to complete, error ${error}`)
    }

  //------------------------------------------------------
}