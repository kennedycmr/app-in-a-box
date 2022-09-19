//------------------------------------------------------
//  Handler for all login events
//  Designed to handle the login process, handle failures and if success give a user an getAccessToken
//  The 'LoginHandlerComponent' is built to handle both 'authState'
//    'authenticated'
//    'unauthenticated'
//------------------------------------------------------


//Libraries
import React, { useContext } from 'react';
import App from "../App";
import { BrowserRouter } from 'react-router-dom';
import { getAuth} from "firebase/auth";
import {GetAppStatus, GetAppErrors} from './UserContexts';

//Components
import Login from './Login';
import Logout from './Logout';

//Images
import LoadingIcon from '../Components/Images/Loading_Ripple.svg';
import Logo from '../Components/Images/logo192.png';
import GrumpyCatSigninPrompt from '../Components/Images/grump_cat_signin_prompt.svg';

//Styling for login page
import './LoginHandler.css';


function LoginHandler() {

  //------------------------------------------------------
  //  Import Firebase
  //  https://firebase.google.com/docs/auth/web/microsoft-oauth#next_steps
  //------------------------------------------------------

    // eslint-disable-next-line
    const auth = getAuth();

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const getAppStatus = useContext(GetAppStatus)
    const getAppErrors = useContext(GetAppErrors)

  //------------------------------------------------------
  //  Authorised Users
  //------------------------------------------------------

    if (getAppStatus === "authenticated"){

      //Return the App
      return (
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      )
    }

  //------------------------------------------------------
  //  Expired
  //------------------------------------------------------

    else if (getAppStatus === "expired"){
      
      return (
        <div className='App'>
          <div className='ErrorHandler-Container'>
            <div>
              <h2>Oops!</h2>
              <br></br>
              <p className="LoginHandlerComponent-body"> 
                We see that you've moved onto something else, so we logged you out.
              </p>
              <br></br>
            </div>
            <Logout title="Return to sign in page"></Logout>
          </div>
      </div>
      )
    }

  //------------------------------------------------------
  //  Pending
  //------------------------------------------------------

    else if (getAppStatus === "pending"){

      return (
        <div style={{textAlign: "center", height: "100vh", padding: "10% 15%"}}>
          <img alt="loading-circle-icon" src={LoadingIcon}></img>
          <Logout title="Cancel"></Logout>
        </div>
      )
    }

  //------------------------------------------------------
  //  Failed
  //------------------------------------------------------

    else if (getAppStatus === "failed"){

      //------------------------------------------------------
      //  Handles each known error message, with a generic catch all response!
      //------------------------------------------------------

        function HandleErrorMessage(message){

          //General catch, to ensure something exists
          if (message === undefined) return;

          //Allow third-party cookies
          if (message.includes("web-storage-unsupported")){
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  Allow <a target="_blank" rel="noopener noreferrer" href="https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop">third-party cookies</a> in your browser
                </div>
              </div>
            )
          }

          //Failed to verify the users credenitals, user must close tab and sign in again
          if (message.includes("auth/invalid-credential")){
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  Failed verify your credentials, close the browser and try again.
                </div>
              </div>
            )
          }

          //Failed to verify the users credenitals, user must close tab and sign in again
          if (message.includes("auth/popup-closed-by-user")){
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  Complete the sign in process with the popup.
                </div>
              </div>
            )
          }

          //General catch all
          else{
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  This issue requires support, please contact someone@whocares.com and provide the above error message.
                </div>
              </div>
            )
          }
        }

      //------------------------------------------------------
      //  Show 'Oops, something went wrong!' page 
      //------------------------------------------------------

        return (
          <div className='App'>
            <div className='ErrorHandler-Container' style={{lineHeight: "1.7"}}>
              
              <h2>Oops, something went wrong!</h2>
              <br></br>

              <h5>Error</h5>
              <div>{getAppErrors}</div>
              
              {HandleErrorMessage(getAppErrors)}
              <br></br>

              <div style={{marginTop: "20px"}}>
                <Logout title="Return to sign in page"></Logout>
              </div>
            </div>
          </div>
        )
    }

  //------------------------------------------------------
  //  Pending Signin
  //------------------------------------------------------

    else if (getAppStatus === 'pending-signin'){
      return (
        <div className='App'>
          <div className='ErrorHandler-Container' style={{lineHeight: "1.7"}}>
            <img alt='Session Timed Out!' src={GrumpyCatSigninPrompt}></img>
          </div>
        </div>
      )
    }

  //------------------------------------------------------
  //  Failed
  //------------------------------------------------------

    else if (getAppStatus === "failed"){

      //------------------------------------------------------
      //  Handles each known error message, with a generic catch all response!
      //------------------------------------------------------

        function HandleErrorMessage(message){

          //General catch, to ensure something exists
          if (message === undefined) return;

          //Allow third-party cookies
          if (message.includes("web-storage-unsupported")){
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  Allow <a target="_blank" rel="noopener noreferrer" href="https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop">third-party cookies</a> in your browser
                </div>
              </div>
            )
          }

          //Failed to verify the users credenitals, user must close tab and sign in again
          if (message.includes("auth/invalid-credential")){
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  Failed verify your credentials, close the browser and try again.
                </div>
              </div>
            )
          }

          //Failed to verify the users credenitals, user must close tab and sign in again
          if (message.includes("auth/popup-closed-by-user")){
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  Complete the sign in process with the popup.
                </div>
              </div>
            )
          }

          //General catch all
          else{
            return(
              <div style={{marginTop: "20px"}}>
                <h5>Solution</h5>
                <div>
                  This issue requires support, please contact someone@whocares.com and provide the above error message.
                </div>
              </div>
            )
          }
        }

      //------------------------------------------------------
      //  Show 'Oops, something went wrong!' page 
      //------------------------------------------------------

        return (
          <div className='App'>
            <div className='ErrorHandler-Container' style={{lineHeight: "1.7"}}>
              
              <h2>Oops, something went wrong!</h2>
              <br></br>

              <h5>Error</h5>
              <div>{getAppErrors}</div>
              
              {HandleErrorMessage(getAppErrors)}
              <br></br>

              <div style={{marginTop: "20px"}}>
                <Logout title="Return to sign in page"></Logout>
              </div>
            </div>
          </div>
        )
    }

  //------------------------------------------------------
  //  Un-Authorised Users
  //------------------------------------------------------

    else if (getAppStatus === 'unauthenticated'){
      return (
        <div className='App'>
          <div className='LoginHandler-Container'>
            {/* Login Graphic */}
            <div>
              <img className="Login-Graphic" src={Logo} alt="Login-Graphic"></img>
            </div>

            {/* Login Pane */}
            <div className="Login-Detail">
              <h3>Cloud Studio Events</h3>
              
              <div>
                Please click below to sign in to the app.
              </div>
              
              {/* Login Button */}
              <div className='Login-Button'>
                <Login></Login>
              </div>
            
            </div>
          </div>
        </div>
      )
    }

  //------------------------------------------------------
}

export default LoginHandler;