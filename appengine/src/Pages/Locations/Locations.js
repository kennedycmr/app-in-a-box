//------------------------------------------------------
//  Locations Page
//------------------------------------------------------

//Libraries
import React, {useState, useEffect, useContext} from 'react'

//Components
import PageResponse from '../../Components/PageResponse/PageResponse'
import AddLocation from './AddLocation'
import EditLocation from './EditLocation'

//Contexts
import {SetUserError} from '../../Library/UserContexts'
import {SetAdminError} from '../../Library/UserContexts'

//Images
import EditIcon from '../../Components/Images/Edit_Icon.svg'

//Functions
import GetCollection from '../../Library/GetCollection'

//CSS
import './Locations.css'

export default function Locations() {
    
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
  //  Functions
  //------------------------------------------------------

    //Controls the traversal to the delete page
    //Required additional logic to prevent lockout
    function GoToEditPage(location){

      //Check on null
      if(location.locationid === undefined) return

      //Save user and change request type
      setSelectedLocation(location)
      setRequestType("edit")
    }

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
          setAdminError(`GetCollection for members has failed, error: ${error}`)
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
          {locations.length > 0 ? 
            //If locations found > return list of locations
            (
              <div className="Table-Container">
                <table width="100%">
                  <colgroup>
                      <col span="1" style={{width: "10%"}}></col>
                      <col span="1" style={{width: "15%"}}></col>
                      <col span="1" style={{width: "55%"}}></col>
                      <col span="1" style={{width: "20%"}}></col>
                  </colgroup>
                  <tbody>
                      <tr className="Table-Header">
                        <th className="Table-th"></th>
                        <th className="Table-th">Location</th>
                        <th className="Table-th">Address</th>
                        <th className="Table-th">
                            <button className="Primary-Button" style={{float: "right"}} onClick={() => setRequestType("create")}>
                                Add Location
                            </button>
                        </th>
                      </tr>
                      {locations.map(object => (
                        <tr key={object.locationid}>
                          <td className="Table-td" style={{textAlign: "center"}}>
                            <img className="Locations-Edit-Img" src={EditIcon} alt="Edit-Img" onClick={() => GoToEditPage(object)}></img>
                          </td>
                          <td className="Table-td">{object.locationname}</td>
                          <td className="Table-td">{object.fulladdress}</td>
                          <td className="Table-td"></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )
            : 
            (
              // Else > return message
              <div style={{textAlign: "left", margin: "2%"}}>
                No locations found.
                <button className="Primary-Button" style={{float: "right"}} onClick={() => setRequestType("create")}>
                    Add Location
                </button>
              </div>
            )
          }
        </div>
      ]}
      pageCreate={[
        <AddLocation
            setRequestType={setRequestType}
        ></AddLocation>       
      ]}
      pageEdit={[
        <div>
          <EditLocation
            setRequestType={setRequestType}
            location={selectedLocation}
          ></EditLocation>  
        </div>
      ]}
    ></PageResponse>
  )

  //------------------------------------------------------
}