//========================================================
//  Component: Error Handler
//========================================================

//  Purpose:
//    1. Generic way to show users an error
//    2. Allows client side errors to be sent to Cloud Logging
//    3. Supports two 'requestType'
//      error-invalid = {user generated error}
//      error-fatal = {system generated error, needs to be logged}
//      undefined = {known error, needs to be logged}

//  Properties:
//    requestType = {This is an optional prop, typically used by page response}

//  Example:
//    In my booking form, write any errors to these useContexts
//    setError(`Create Booking form has failed, error: ${error}`)

//    Now you can import the below component and the error will be shown and logged to Cloud Logging.
//    <ErrorHandler
//      requestType='error-fatal'
//    ></ErrorHandler>

//========================================================

//Libraries
import React, {useContext, useEffect} from 'react';

//Contexts
import {GetFireBaseUser, GetError, SetError} from '../../Library/UserContexts';

//Functions
import WriteDocument from '../../Library/WriteDocument';

//CSS
import './ErrorHandler.css';

//Images
import SinkingShip from '../Images/SinkingShip.svg';
import SinkingShip2 from '../Images/SinkingShip2.svg';

export default function ErrorHandler(props){

  //------------------------------------------------------
  //  props
  //------------------------------------------------------

    const requestType = props.requestType

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const getFirebaseUser = useContext(GetFireBaseUser)
    const getError = useContext(GetError)
    const setError = useContext(SetError)

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //Checks for userError & adminError mesages and writes them to Firestore
    useEffect(() => {

      if(getError === undefined) return;
      if(getFirebaseUser === undefined) return;
      if(requestType === 'error-invalid') return;

      const documentId = `${Date.now()}`;
      const document ={
        id: `${documentId}`,
        emailaddress: `${getFirebaseUser.emailaddress}`,
        message: `${getError}`
      };

      //Send and forget > the unknown error could be prevent the user from accessing Firestore!
      WriteDocument('failures', documentId, document, false);

      //Clear any old message
      setError(undefined);

    // eslint-disable-next-line 
    }, [getFirebaseUser, getError])

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    //------------------------------------------------------
    // error-invalid
    //------------------------------------------------------

      if (requestType === 'error-invalid'){
        return(
          <div className='ErrorHandler-Container'>
            <br></br>
            <img src={SinkingShip2} alt="Sinking-Ship2" style={{height:350}}/>  
            <div style={{padding: "30px", lineHeight: "1.8"}}>
              Sorry that doesn't look right...
              <br></br>
              Please try again. If the issue persists, please contact us at <strong>someone@whocares.com</strong>
            </div>
            <button className='Primary-Button' onClick={()=>{window.location.reload()}}> Try Again </button>
  
          </div>
        ) 
      }

    //------------------------------------------------------
    // error-fatal
    //------------------------------------------------------

      else if (requestType === 'error-fatal'){
        return(
          <div className='ErrorHandler-Container'>
            <br></br>
            <h2>Oops! Something went wrong.</h2>
            <br></br>
            <img src={SinkingShip} alt="Sinking-Ship" style={{height:350}}/>  
            <div style={{padding: "30px", lineHeight: "1.8"}}>
              We're not sure what happened.
              <br></br>
              Please try again. If the issue persists, please contact us at <strong>someone@whocares.com</strong>
            </div>
            <button className='Primary-Button' onClick={()=>{window.location.reload()}}> Try Again </button>
          </div>
        ) 
      }

    //------------------------------------------------------
    // catch all
    //------------------------------------------------------

      else {
        return(
          <div className='ErrorHandler-Container'>
            <br></br>
            <h2>Oops! Something went wrong.</h2>
            <br></br>
            <img src={SinkingShip} alt="Sinking-Ship" style={{height:350}}/>  
            <div style={{padding: "30px", lineHeight: "1.8"}}>
              We're not sure what happened.
              <br></br>
              Please try again. If the issue persists, please contact us at <strong>someone@whocares.com</strong>
            </div>
            <button className='Primary-Button' onClick={()=>{window.location.reload()}}> Try Again </button>
  
          </div>
        ) 
      }
}
