//------------------------------------------------------
//    Logout Handler > Allows the user to click a button to Signout
//------------------------------------------------------

//Libraries
import React, {useContext} from "react";
import { getAuth, signOut } from "firebase/auth";

//Contexts
import {SetAppStatus} from './UserContexts'

//Images
import LogoutImage from '../Components/Images/Logout.png'


export default function Logout(props) {

  //------------------------------------------------------
  // props
  //------------------------------------------------------

    const title = props.title
    const setStyle = props.setStyle

  //------------------------------------------------------
  // useContexts & useStates
  //------------------------------------------------------

    //Firebase
    const setAppStatus = useContext(SetAppStatus)

  //------------------------------------------------------
  //  Import Firebase
  //  https://firebase.google.com/docs/auth/web/microsoft-oauth#next_steps
  //------------------------------------------------------

    const auth = getAuth();

  //------------------------------------------------------
  //  Logout handler
  //------------------------------------------------------

    function LogOutHandler(){

      signOut(auth).then(() => {

        setAppStatus("unauthenticated");

      })
      //An error happened.
      .catch(() => {

        setAppStatus("unauthenticated");

      })
    }

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    //------------------------------------------------------
    //  Navbar signout button
    //------------------------------------------------------

      if (setStyle === 'navbar'){
        return (
          <div style={{borderTop: "1px solid rgb(236, 236, 236)"}}>
            <button style={{borderRadius: 25}} className="NavBar-Button" onClick={() => LogOutHandler()}>
              <img className="Logout-Icon" src={LogoutImage} alt="Logout Icon" width="15px" height="15px"></img>
              {title}
            </button>
          </div>
        )
      }
    
    //------------------------------------------------------
    //  Normal button
    //------------------------------------------------------

      else{
        return (
          <div style={{alignContent: "center"}}>
            <button className="Primary-Button" onClick={() => LogOutHandler()}>
              {title}
            </button>
          </div>
        )
      }

    //------------------------------------------------------
}