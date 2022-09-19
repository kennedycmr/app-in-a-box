//========================================================
//  Component: Location Card 
//  Description: Displays location details
//========================================================

//  Properties:
//    - key = {unique key for location, e.g. id}
//    - location = {location object containing address, name, etc.}
//    - setSelectedLocation = {setState function for setting selected location}
//    - setRequestType = {setState function for setting request type (used to change page view)}

//  Example:
//    <LocationCard 
//      key={object.id}
//      location={object}
//      setSelectedLocation={setSelectedLocation}
//      setRequestType={setRequestType}
//    ></LocationCard>

//========================================================

//Libraries
import React from 'react';

//Images
import Map from '../Images/Map.png'

//CSS
import './LocationCard.css'

function LocationCard(props){
      
  //------------------------------------------------------
  //  Extract Props
  //------------------------------------------------------

    var location = props.location
    var setSelectedLocation = props.setSelectedLocation
    var setRequestType = props.setRequestType
      
  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

  return(
    <div className='Location-Card'>
      
      <p className='Location-Name'>{location.locationname}</p>
      <p className="Location-Address">{location.fulladdress}</p>

      <button className="Primary-Button" onClick={() => {setSelectedLocation(location); setRequestType("create")}}>Book Now</button>
      <button className="Secondary-Button" onClick={() => {setSelectedLocation(location); setRequestType("view")}}>
        <img className="Map-Icon" src={Map} alt="Map"></img>
        View Map
      </button>

    </div>
  ) 
}

//------------------------------------------------------

export default LocationCard;