//================================================================
//  Component: Navbar
//================================================================

//  Purpose: The Navbar for Events App

//  Properties:
//    - name = {A string, this is the persons name}
//    - message = {A string, a short message}

//  Example:
//    <Example
//      name={"Mark Bennett"}
//      message={"stop breaking stuff!"}
//    ></Example>    

//================================================================


//Libraries
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";

//Contexts
import {GetUser} from '../../Library/UserContexts'

//Images
import CloudLogo from '../Images/Cloud_Logo.png'

//CSS
import './Navbar.css'


export default function Navbar() {
  
  //------------------------------------------------------
  //  react router
  //------------------------------------------------------
  
    const navigate = useNavigate();
    
  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
    const getUser = useContext(GetUser);    

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to determine current view on this page > "pending", "success"
    const [componentStatus, setComponentStatus] = useState('pending');

    //Holds the current route
    const location = useLocation();

    //Hold the nav item styles
    const [mySubStyle, setMySubStyle] = useState('Navbar-Items-Container-Link');
    const [publishStyle, setPublishStyle] = useState('Navbar-Items-Container-Link');
    const [myProductsStyle, setMyProductsStyle] = useState('Navbar-Items-Container-Link');


  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------

    function IsAdmin(){
      if (getUser === undefined) return;

      if (getUser?.roles.isAdmin){
        return(
          <Link className={myProductsStyle} to="/registrations">
          Registrations
          </Link>
        )
      };
    };

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //Simple useEffect to ensure a profile exists before showing navbar
    useEffect(() =>{

      if (getUser === undefined) return;
      setComponentStatus('success')
    }, [getUser])

    //Check the current route > update highlighted button
    useEffect(() =>{

      if (location.pathname === '/events'){
  
        setMySubStyle('Navbar-Items-Container-Link-Active');
        setPublishStyle('Navbar-Items-Container-Link');
        setMyProductsStyle('Navbar-Items-Container-Link');

      }
      else if (location.pathname === '/myevents'){

        setMySubStyle('Navbar-Items-Container-Link');
        setPublishStyle('Navbar-Items-Container-Link-Active');
        setMyProductsStyle('Navbar-Items-Container-Link');

      }
      else if (location.pathname === '/registrations'){

        setMySubStyle('Navbar-Items-Container-Link');
        setPublishStyle('Navbar-Items-Container-Link');
        setMyProductsStyle('Navbar-Items-Container-Link-Active');

      }
      else {

        setMySubStyle('Navbar-Items-Container-Link');
        setPublishStyle('Navbar-Items-Container-Link');
        setMyProductsStyle('Navbar-Items-Container-Link');

      }

    }, [location])

  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  if(componentStatus === 'pending'){
    return (
      <div className='Navbar-Container'>
  
        {/* Logo */}
        <div className='Navbar-Logo'>
          <Link to="/">
            <img className="Logo" src={CloudLogo} alt="Cloud Logo" onClick={() => navigate("/events")}></img>
          </Link>
        </div>

        {/* Sidebar Items */}
        <div className='Navbar-Items-Container'>
          Loading...
        </div>
  
      </div>
    )
  }

  else if (componentStatus === 'success'){
      return (
        <div className='Navbar-Container'>
    
          {/* Logo */}
          <div className='Navbar-Logo'>
            <Link to="/">
              <img className="Logo" src={CloudLogo} alt="Cloud Logo"></img>
            </Link>
            <p> Hi {getUser?.emailaddress.split('.')[0][0].toUpperCase() + getUser?.emailaddress.split('.')[0].slice(1)}!</p>
          </div>
          
          {/* Sidebar Items */}
          <div className='Navbar-Items-Container'>
            <Link className={mySubStyle} to="/events">
              Events
            </Link>
            <Link className={publishStyle} to="/myevents">
              My Events
            </Link>
            {IsAdmin()}
          </div>
    
        </div>
      )
    }

}
