import React, {useContext} from 'react'
import { getAuth, signInWithPopup } from "firebase/auth";
import {GetFireBaseProvider, SetAppStatus, SetAppErrors} from './UserContexts'

export default function Login() {

  //------------------------------------------------------
  //  Import Firebase
  //  https://firebase.google.com/docs/auth/web/microsoft-oauth#handle_the_sign-in_flow_with_the_firebase_sdk
  //------------------------------------------------------

    const auth = getAuth();

  //------------------------------------------------------
  // useContexts & useStates
  //------------------------------------------------------

    //Firebase
    const Provider = useContext(GetFireBaseProvider);
    const setAppStatus = useContext(SetAppStatus);
    const setAppErrors = useContext(SetAppErrors);

  //------------------------------------------------------
  // Define the function used to sign in
  // The below code will detect errors and present them to the user
  // https://firebase.google.com/docs/auth/web/microsoft-oauth#web-version-9_4
  //------------------------------------------------------

    function SignIn(){

      //Set the app to a pending state
      setAppStatus('pending-signin');

      //Using 'signinwithpopup' due to third party cookie issues
      //https://github.com/firebase/firebase-js-sdk/issues/3004
      signInWithPopup(auth, Provider).then((userToken) =>{
        
        if(userToken){
    
          //Promise has been fulfilled, so user has signed in successfully! 
          setAppStatus('authenticated');

        }
      })
      .catch((error) =>{

        setAppStatus('failed');
        setAppErrors(error.message);

      })
    }

  //------------------------------------------------------
  //  Return
  //------------------------------------------------------

    return (
      <button className="Primary-Button" onClick={SignIn}>Sign in</button>
    )

  //------------------------------------------------------
}