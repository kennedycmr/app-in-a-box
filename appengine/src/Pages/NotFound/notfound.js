//------------------------------------------------------
//  404 - Not Found Page
//  If no route for this page is found
//  Created by Mark Bennett 05/11/2021
//------------------------------------------------------

//Libraries
import React from 'react'
import { Link } from "react-router-dom";

//Styling
import './notfound.css'


export default function NotFound() {
  
  //------------------------------------------------------
  //  Returned HTML
  //------------------------------------------------------

    return (
        <div className="NotFound-Container">

        {/* Title */}
       <p className="NotFound-Title"><b>Error 404</b> -  Page not found. </p>
       <p>Sorry, the page you are looking for does not exist.</p>

       <Link to="/events">
          <button className="Primary-Button">
            Return Home
          </button>
        </Link>  

      </div>
    )

  //------------------------------------------------------
}
