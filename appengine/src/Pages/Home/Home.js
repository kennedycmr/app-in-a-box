//------------------------------------------------------
//  Home Page
//------------------------------------------------------

//Libraries
import React, { useState, useEffect, useContext } from 'react'

//Functions
import GetCollection from '../../Library/GetCollection'

//Components
import PageResponse from '../../Components/PageResponse/PageResponse.js'
import LocationCard from '../../Components/LocationCard/LocationCard'
import CreateBooking from '../../Components/CreateBooking/CreateBooking'
import MapView from '../../Components/MapView/MapView';

//Contexts
import {SetUserError} from '../../Library/UserContexts'
import {SetAdminError} from '../../Library/UserContexts'

//Images
import Logo from '../../Components/Images/Logo.png'

//Styles
import './Home.css'

export default function Home() {

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to determine current view on this page > "pending", "onload", "view", "create", "edit", "delete", "manage"
    const [requestType, setRequestType] = useState("pending")

    //State used to store list of all locations
    const [locations, setLocations] = useState([]);

    //State used to selected location
    const [selectedLocation, setSelectedLocation] = useState("");


  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const setUserError = useContext(SetUserError)
    const setAdminError = useContext(SetAdminError)

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //When requestType changes > get list of all locations
    useEffect(() => {

      if(requestType === "pending"){

       GetCollection("locations")
       //Success > Load the page
       .then((results) =>{
          setLocations(results)
          setRequestType("onload")

        })
        //Error > show error page
        .catch((error) =>{
          setRequestType('failed')

          //Submit error to global store > This will be catured by ErrorHandler
          setUserError("Unable to get locations.")
          setAdminError(`GetCollection for locations has failed, error: ${error}`)
        })
        
      }
      
    // eslint-disable-next-line 
    },[requestType])


  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

  return (
    <PageResponse
      requestType={requestType}
      pageOnload={[
        <div>
          {/* Page Header */}
          <div className="Home">

            {/* Logo */}
            <img className="Logo" src={Logo} alt="The Local Office"></img>
            <h2>App in a Box</h2>
            
          </div>

          {/* Divider */}
          <div className="Divider"></div>

          {/* Locations Catalogue */}
          <div>
            {locations.length > 0 ? 
              (
                //If locations found > return list of locations
                <div>
                  {locations.map(object => (
                    <LocationCard 
                      key={object.locationid}
                      location={object}
                      setSelectedLocation={setSelectedLocation}
                      setRequestType={setRequestType}
                    ></LocationCard>
                  ))}
                </div>
              )
              : (
                // Else > return message
                <div style={{margin: "2%"}}>
                  No results found.
                </div>
              )}
          </div>
        </div>
      ]}
      pageView={[
        <MapView
          location={locations[Object.keys(locations).find(key => locations[key] === selectedLocation)]}
          setRequestType={setRequestType}
        ></MapView>
      ]}
      pageCreate={[
        <CreateBooking
          locations={locations}
          selectedLocation={selectedLocation}
          setRequestType={setRequestType}
        ></CreateBooking>        
      ]}
    ></PageResponse>
  )
  //------------------------------------------------------
}