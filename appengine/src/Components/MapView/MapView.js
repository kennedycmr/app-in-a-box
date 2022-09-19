//========================================================
//  Component: Map View 
//  Description: Displays Google Map View of Location
//========================================================

//  Properties:
//    - location = {location object containing address, name, etc.}

//  Example:
//    <MapView
//      location={locations[Object.keys(locations).find(key => locations[key] === selectedLocation)]}
//    ></MapView>

//========================================================

//Libraries
import React from "react";
import { Link } from "react-router-dom";

//Images
import Back from '../Images/Go-Back-Button.svg'

//CSS
import './MapView.css'

export default function MapView(props) {

  //------------------------------------------------------
  //  Extract props
  //------------------------------------------------------

    var setRequestType = props.setRequestType
    var location = props.location
    var locationaddress = location.fulladdress
    var addressstring = locationaddress.replace(/\s/g, "+");


  //------------------------------------------------------
  //  Set Map URL
  //------------------------------------------------------
    
    const apikey = process.env.REACT_APP_MAPS_API_KEY //"INSERT_GCP_MAP_EMBED_API_KEY"
    
    var googleembededmapurl =
      "https://www.google.com/maps/embed/v1/place?key=" + apikey + "&q=";
    googleembededmapurl += addressstring;
  

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    return (
      <div>
        {/* Location Header */}
        <div className="Location-Header">
          
          {/* Name */}
          <div className="Location-Name">
            {location.locationname}

            {/* Back Button */}
            <Link to="/home" onClick={() => setRequestType("pending")}>
              <img className='Back-Button' src={Back} alt='Go Back'></img>
            </Link>  
          </div>
          
          {/* Address */}
          <div className="Location-StreetAddress">
            {locationaddress}
          </div>
          
          {/* Business Hours */}
          <div className="Location-Hours">
              Business Hours: {location.hours.open} to {location.hours.close}
          </div>

        </div>

        {/* MapView iframe */}
        <iframe
          className="Map"
          style={{ marginRight: 1, marginLeft: 1, border: "0.5px solid #C1C8B9" }}
          loading="lazy"
          allowfullscreen
          src={googleembededmapurl}
          title={location.id}
        >
          <h3 style={{ margin: "30px 0px" }}>Map shows location address</h3>
        </iframe>

      </div>
    );
}

//------------------------------------------------------
