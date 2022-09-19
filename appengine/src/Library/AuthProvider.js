//================================================================
//  AuthProvider
//  Created by Mark Bennett
//================================================================

//  Purpose: 
//    1. This component resides in index.js
//    2. Handles any auth interactions with FireBase
//    3. Saves all interactions to the global store

//  Example: 
//    ReactDOM.render(

//      <UserContexts>
//        <AuthProvider>
//            <LoginHandler></LoginHandler>
//        </AuthProvider>
//      </UserContexts>,

//    document.getElementById("root")
//    );

//================================================================

//Libraries
// eslint-disable-next-line
import React, { useContext, useEffect } from 'react'
import { getAuth, onAuthStateChanged, OAuthProvider } from "firebase/auth";

//Functions
import QueryDocument from './QueryDocument'
import WriteDocument from './WriteDocument'

//Contexts
import {SetFireBaseProvider, SetFireBaseUser, SetUser, GetAppStatus, SetAppStatus, SetAppErrors} from './UserContexts'


export default function AuthProvider({children}) {

  //------------------------------------------------------
  //  Firebase
  //------------------------------------------------------

    const auth = getAuth();

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const setFirebaseUser = useContext(SetFireBaseUser);
    const setUser = useContext(SetUser);
    const setContextProvider = useContext(SetFireBaseProvider);
    const getAppStatus = useContext(GetAppStatus);
    const setAppStatus = useContext(SetAppStatus);
    const setAppErrors = useContext(SetAppErrors);

  //------------------------------------------------------
  //  Find the users current auth state when the apps auth state changes
  //------------------------------------------------------

    useEffect(() => {

      onAuthStateChanged(auth, (user) =>{

        //Successful sign in 
        if(user){

          //------------------------------------------------------
          //  Save Firebase profile to useContext
          //------------------------------------------------------

          setFirebaseUser(user);

          //------------------------------------------------------
          //  Get or Create user profile
          //------------------------------------------------------

          QueryDocument(`users`, [["uid", "==", user.uid]]).then((results) =>{
            //Create user profile
            if(results.length === 0){
              const document = {
                "uid": user.uid,
                "emailaddress": user.email,
                "roles": {
                  "isUser": true,
                  "isAdmin": false
                }
              }
              WriteDocument('users', user.uid, document, false).then(() =>{

                setUser(document);
                setAppStatus("authenticated");

              })
              .catch((error) =>{

                setAppErrors(`Failed to create user profile, error ${error}`);
                setAppStatus("failed");

              })
            }

            //Found user profile
            else if (results.length === 1){

              setUser(results[0]);
              setAppStatus("authenticated");

            }

            //Shouldn't be possible > more then one user document
            else{

              setAppErrors("Found more then one user document, contact your administrator.");
              setAppStatus("failed");

            }
          })
          .catch((error) =>{

            setAppErrors(`Failed to sign in, error ${error}`);
            setAppStatus("failed");

          })
        }

        //Ask the user signin
        else {

          setAppStatus('unauthenticated');
    
        }

      });

    // eslint-disable-next-line
    }, []);

    //Save the auth state to session storage
    //This allows us to presist data after refreshes
    useEffect(() => {

      sessionStorage.setItem("getAppStatus", getAppStatus);

    }, [getAppStatus]);


  //------------------------------------------------------
  //  Define firebase OAuthProvider > 'microsoft.com'
  //------------------------------------------------------

    useEffect(() => {

      //We want to use the 'OAuthProvider' > 'microsoft.com'
      const Provider = new OAuthProvider('microsoft.com');
      Provider.setCustomParameters(({
        tenant: process.env.REACT_APP_FIREBASE_AZURE_TENANT_ID,
      }))

      //Add scopes
      Provider.addScope('email');
      Provider.addScope('openid');
      Provider.addScope('profile');
      Provider.addScope('User.Read');

      //Save to useContext
      setContextProvider(Provider);

    // eslint-disable-next-line
    }, [])

  //------------------------------------------------------
  //  Pass down all Parent components to childern
  //------------------------------------------------------

    return children;

  //------------------------------------------------------
}
