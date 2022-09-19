//================================================================
//  UserContexts
//  Created by Mark Bennett
//================================================================

//  Purpose: A place to define global states that are shared across components without the need for props

//  Training Material:
//   https://www.w3schools.com/react/react_usecontext.asp
//   https://stackoverflow.com/questions/64256481/referenceerror-cannot-access-usercontext-before-initialization-react
//   https://mindsers.blog/post/updating-react-context-from-consumer/

//  Example:
//    1. Import the useContext
//      import {GetFireBaseUser, GetError, SetError} from '../../Library/UserContexts'
//    2. Import useContext in react
//      import React, {useContext} from 'react';
//    3. Define context in your component
//      const getFirebaseUser = useContext(GetFireBaseUser)
//    4. Use the context, like any useState
//      if(getFirebaseUser === undefined) return;

//================================================================

//Library
import React, {useState} from 'react'

//Contexts:

//Auth config, status and errors
export const GetFireBaseProvider = React.createContext();
export const SetFireBaseProvider = React.createContext();
export const GetAppStatus = React.createContext();
export const SetAppStatus = React.createContext();
export const GetAppErrors = React.createContext();
export const SetAppErrors = React.createContext();

//Firebase user and profile
export const GetFireBaseUser = React.createContext();
export const SetFireBaseUser = React.createContext();
export const GetUser = React.createContext();
export const SetUser = React.createContext();

//Component and page errors
export const GetError = React.createContext();
export const SetError = React.createContext();


export default function UserContexts({children}) {

  //------------------------------------------------------
  //  Define a useState to each context
  //------------------------------------------------------

    const [fireBaseProvider, setFireBaseProvider] = useState();
    const [appStatus, setAppStatus] = useState('pending');
    const [appErrors, setAppErrors] = useState();

    const [firebaseUser, setFirebaseUser] = useState();
    const [getUser, setUser] = useState();

    const [getErrors, setErrors] = useState();

  //------------------------------------------------------
  //  Pass down all Parent components & contexts to childern
  //------------------------------------------------------

    return (

      <GetFireBaseProvider.Provider value={fireBaseProvider}>
      <SetFireBaseProvider.Provider value={setFireBaseProvider}>
      <GetAppStatus.Provider value={appStatus}>
      <SetAppStatus.Provider value={setAppStatus}>
      <GetAppErrors.Provider value={appErrors}>
      <SetAppErrors.Provider value={setAppErrors}>

      <GetFireBaseUser.Provider value={firebaseUser}>
      <SetFireBaseUser.Provider value={setFirebaseUser}>
      <GetUser.Provider value={getUser}>
      <SetUser.Provider value={setUser}>

      <GetError.Provider value={getErrors}>
      <SetError.Provider value={setErrors}>

        {children}

      </SetError.Provider>
      </GetError.Provider>

      </SetUser.Provider>
      </GetUser.Provider>
      </SetFireBaseUser.Provider>
      </GetFireBaseUser.Provider>

      </SetAppErrors.Provider>
      </GetAppErrors.Provider>
      </SetAppStatus.Provider>
      </GetAppStatus.Provider>
      </SetFireBaseProvider.Provider>
      </GetFireBaseProvider.Provider>
    )

  //------------------------------------------------------
}