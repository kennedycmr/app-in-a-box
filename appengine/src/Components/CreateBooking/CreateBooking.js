//================================================================
//  Component: Create Booking Form 
//  Description: Generic form that writes to Firestore collection
//================================================================

//  Properties:
//    - locations = {list of locations used to populate dropdown on the form}
//    - selectedLocation = {useState storing the current location selected by the user}
//    - setRequestType = {setState function for setting request type (used to change page view)}

//  Example:
//    <CreateBooking
//      locations={locations}
//      selectedLocation={selectedLocation}
//      setRequestType={setRequestType}
//    ></CreateBooking>    

//================================================================

//Libraries
import React, {useState, useContext} from 'react'
import {Button, Form} from "react-bootstrap"

//Functions
import WriteDocument from '../../Library/WriteDocument'
import CompoundQuery from '../../Library/CompoundQuery';

//Contexts
import {GetFireBaseUser, SetUserError, SetAdminError} from '../../Library/UserContexts'

//Images
import BackIcon from '../../Components/Images/Go-Back-Button.svg'
import ThankYouGraphic from '../../Components/Images/Logo.png'

//CSS
import './CreateBooking.css'


export default function CreateBooking(props) {

  //------------------------------------------------------
  //  Extract Props
  //------------------------------------------------------

    var selectedLocation = props.selectedLocation
    var setRequestType = props.setRequestType

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const getContextUser = useContext(GetFireBaseUser)
    const setUserError = useContext(SetUserError)
    const setAdminError = useContext(SetAdminError)
 
  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------
    
    //State for booking form status
    const [formStatus, setFormStatus] = useState("create");

    //State for booking form date picker
    var today = new Date().toISOString().slice(0, 10)
    const [bookingDate, setBookingDate] = useState(today);


    //State for show/hide booking submitted message
    const [duplicateBookingMsgHide, setDuplicateBookingMsgHide] = useState(true);

  //------------------------------------------------------
  //  Event Handler (Form Submission)
  //------------------------------------------------------

    //Submit Form > Check for duplicates > Write to Firestore
    const handleFormSubmit = (e) =>{

      //This prevents the form from been submitted
      var preventSubmit = false;
      
      //Generate using booking ID and prepare booking date
      var bookingId = "BK-" + Date.now()
      let bookingdate = new Date(bookingDate);

      //Prepare Firestore Document Object
      const document = {
        "bookingid": bookingId,
        "locationid": selectedLocation.locationid,
        "name": selectedLocation.locationname,
        "address": selectedLocation.fulladdress,
        "day": parseInt(bookingdate.getDate()).toString(),
        "month": parseInt(bookingdate.getMonth() +1).toString(),
        "year": parseInt(bookingdate.getYear() +1900).toString(),
        "requester": getContextUser.emailaddress,
        "firstname": e.target.firstname.value,
        "lastname": e.target.lastname.value,
        "phone": e.target.phone.value,
        "status": "pending"
      }

      console.log("document", document)

      //Define list of queries for checking duplicate bookings
      var queries = [
        ["requester", "==", getContextUser.emailaddress],
        ["locationid", "==", document.locationid],
        ["day", "==", document.day],
        ["month", "==", document.month],
        ["year", "==", document.year]
      ]
      
      //Check for duplicate bookings
      CompoundQuery("bookings", queries).then((results) => {

        //If duplicate booking exists > prevent form submission
        if(results.length > 0){
          setDuplicateBookingMsgHide(false)
          preventSubmit = true;

        } else{
          setDuplicateBookingMsgHide(true)
        }

        //If duplicate booking does NOT exist > submit form and write to Firestore
        if(preventSubmit === false) {

          return WriteDocument('bookings', bookingId, document, false)
          //If success > show thank you message
          .then((results) =>{
            setFormStatus('success')
          })
      
        }
      })
      //Error > Show error page
      .catch((error) =>{
        setRequestType('failed')

        //Submit error to global store > This will be catured by ErrorHandler
        setUserError("Unable to submit booking.")
        setAdminError(`Create Booking form has failed, error: ${error}`)
      })

      //Prevent reload
      e.preventDefault();

    }

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------
    
    //------------------------------------------------------
    //  formStatus === 'create'
    //------------------------------------------------------
    
      if (formStatus === 'create'){

        const textFieldValidation = "(^[A-Za-z0-9/,. ]+$)"

        return (
          <div className="Form">

            {/* Form Header */}
            <div className='Form-Header'>

              {/* Form Title */}
              Book a Desk
              
              {/* Back Button */}
              <img className='Back-Button' src={BackIcon} alt='back-button-icon' onClick={() => setRequestType("pending")}></img>
              
            </div>

            {/* Duplicate Booking Error Message */}
            <div hidden={duplicateBookingMsgHide}>
              <center><p style={{color:"red", lineHeight: "1.7"}}>A booking for this date and location already exists. Please select a different date.</p></center>
            </div>

            {/* Booking Form */}
            <Form onSubmit={handleFormSubmit}>
              
              {/* Location */}
              <Form.Group className="mb-3" controlId="location">
                
                <div className="Label-Field-Title"><Form.Label>Location</Form.Label></div>
                <div className="Label-Field-Value"><Form.Label>{selectedLocation.locationname}</Form.Label></div>
 
              </Form.Group>

              {/* Booking Date */}
              <Form.Group className="mb-3" controlId="bookingdate">
                <div className="Label-Field-Title"><Form.Label>Booking Date</Form.Label></div>
                <div className="Label-Field-Value">
                  <Form.Control 
                    required
                    controlId="bookingdate"
                    type="date"
                    defaultValue={today}
                    min={today}
                    onChange={(e) => setBookingDate(e.target.value)}
                    >
                  </Form.Control>
                </div>
              </Form.Group>

              {/* Email Address */}
              <Form.Group className="mb-3" controlId="emailaddress">
                <div className="Label-Field-Title"><Form.Label>Email Address</Form.Label></div>
                <div className="Label-Field-Value"><Form.Label>{getContextUser.emailaddress}</Form.Label></div>
              </Form.Group>

              {/* First Name */}
              <Form.Group className="mb-3" controlId="firstname">
                <div className="Label-Field-Title"><Form.Label>First Name</Form.Label></div>
                <Form.Control required type="text" pattern={textFieldValidation} placeholder="" defaultValue={getContextUser.firstname}></Form.Control>
              </Form.Group>
              
              {/* Last Name */}
              <Form.Group className="mb-3" controlId="lastname">
                <div className="Label-Field-Title"><Form.Label>Last Name</Form.Label></div>
                <Form.Control required type="text" pattern={textFieldValidation} placeholder="" defaultValue={getContextUser.lastname}></Form.Control>
              </Form.Group>

              {/* Phone Number */}
              <Form.Group className="mb-3" controlId="phone">
                <div className="Label-Field-Title"><Form.Label>Phone</Form.Label></div>
                <Form.Control 
                  required
                  type="phone"
                  placeholder="(XX) XXXX XXXX / XXXXXXXXXX"
                  defaultValue={getContextUser.phone}
                  pattern="(^(\(?[0-9]{2}\))?\s?(\d{8}|\d{4}\s\d{4})$|^\d{10}$)"
                  >
                </Form.Control>
              </Form.Group>

              {/* Submit Button */}
              <Button className="Submit-Button" style={{fontWeight: "600"}} variant="dark" type="submit">
                Submit
              </Button>

            </Form>
          </div>
        )
      }

    //------------------------------------------------------
    //  formStatus === 'success'
    //------------------------------------------------------

      if (formStatus === 'success'){
        return (
          <div className="Form-Success">
            {/* Thank You Graphic */}
            <div className="ThankYou-Graphic">
              <img src={ThankYouGraphic} alt="Thank you"></img>
            </div>

            {/* Thank You Detail */}
            <div>
              <p className="ThankYou-Heading">Thank You</p>
              <p style={{margin: "20px 0px 25px 0px"}}>
                Your booking request has been sent for approval. Once approved, you will receive an email from one of our partners, confirming your booking details.
              </p> 
              <div style={{margin: "20px 0px"}}>
                <button className="Primary-Button" onClick={() => setRequestType("pending")}>
                  Return Home
                </button>
              </div>
            </div>
          </div>
        )
      }


    //------------------------------------------------------
}

