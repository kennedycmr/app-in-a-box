//------------------------------------------------------
//  Reports Page
//------------------------------------------------------

//Libraries
import React, {useState, useEffect, useContext} from 'react'
import { CSVLink } from "react-csv";
import moment from "moment";

//Components
import PageResponse from '../../Components/PageResponse/PageResponse'

//Functions
import GetCollection from '../../Library/GetCollection'

//Contexts
import {SetUserError} from '../../Library/UserContexts'
import {SetAdminError} from '../../Library/UserContexts'


export default function ExportBookings() {

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to determine current view on this page > "pending", "onload", "view", "create", "edit", "delete", "manage"
    const [requestType, setRequestType] = useState("pending")

    //State used to store list of all members
    const [bookings, setBookings] = useState([]);

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const setUserError = useContext(SetUserError)
    const setAdminError = useContext(SetAdminError)

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //When requestType changes > get data dump of all bookings
    useEffect(() => {

      if(requestType === "pending"){

       GetCollection("bookings")
       //Success > Load the page
       .then((results) =>{
          setBookings(results)
          setRequestType("onload")

        })
        //Error > show error page
        .catch((error) =>{
          setRequestType('failed')

          //Submit error to global store > This will be catured by ErrorHandler
          setUserError("Unable to get reports.")
          setAdminError(`GetCollection for bookings report has failed, error: ${error}`)
        })
        
      }
      
    // eslint-disable-next-line 
    },[requestType])

    
  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    //If bookings exist > display button to download report
    return (

      <PageResponse
        requestType={requestType}
        pageOnload={[
          
          <div>
            {typeof(bookings) === "object" && bookings.length > 0 ? 
              (
                <div style={{margin: "2%"}}>
                  <p>Click below to download a report of all bookings.</p>
                  
                  {/* Download Report Button */}
                  <CSVLink
                    style={{background: "black", fontWeight: "600", borderRadius: "5px", border: '2.5px solid black', padding: "5px 10px", boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.5)"}} 
                    data={bookings}
                    filename={`bookings-${moment(new Date()).format('DD-MM-YYYY')}.csv`}
                    className="btn btn-primary"
                    target="_blank"
                  >
                    Download Report
                  </CSVLink>
                </div>
              )
              : (
                // Else > return message
                <div style={{textAlign: "left", margin: "2%"}}>
                  <p>No bookings found.</p>
                </div>
              )
            }
          </div>
          
        ]}
      ></PageResponse>
    )

    //------------------------------------------------------
}