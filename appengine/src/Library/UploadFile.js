//==========================================================================
//   Function: UploadFile
//   Description: Generic function to upload a file and return a download link
//   Documentation:
//     https://firebase.google.com/docs/storage/web/start
//
//   Function Parameters
//     path = Where you would like to upload the file to, this includes the name and format!
//     file = file in bytes (Use <input type='file'></input>)
//     metadata = object that holds and metadata, https://firebase.google.com/docs/storage/web/upload-files#add_file_metadata
//
//   Example - How to use this function:
//     * If you need another example, check out the 'Upload' component
//
//      UploadFile('images/test.png', fileBytes, metadata).then((url) =>{
//
//        console.log('url', url);
//
//      }).catch((error) =>{
//
//        setErrorMessage(error);
//        setUploadStatus('error-fatal');
//
//      });
//------------------------------------------------------


//Libraries
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";


export default async function UploadFile(path, file, metadata){

  //------------------------------------------------------
  //  Upload File
  //------------------------------------------------------

    try {

      // Create a root reference
      const storage = getStorage();
     
      // Create a reference to 'file' we want to upload
      // 'images/figma.png'
      const storageRef = ref(storage, path);

      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      return uploadTask.then(() =>{

        return getDownloadURL(storageRef).then((results) =>{

          return results;

        })

      }).catch((error) =>{

        throw new Error(`Function UploadFile failed to complete, error ${error}`);

      });

    } catch (error) {

      throw new Error(`Function UploadFile failed to complete, error ${error}`);

    }

  //------------------------------------------------------
}
