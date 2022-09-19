//================================================================
//  Component: Add Location Form 
//  Description: Form for writing to the locations collection
//================================================================

//  Properties:
//    - setRequestType = {setState function for setting request type (used to change page view)}

//  Example:
//    <AddLocation
//      setRequestType={setRequestType}
//    ></AddLocation>    

//================================================================

//Libraries
import React, {useState, useContext} from 'react'
import {Button, Form, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap"

//Functions
import WriteDocument from '../../Library/WriteDocument'
import CompoundQuery from '../../Library/CompoundQuery';

//Contexts
import {GetFireBaseUser, SetUserError} from '../../Library/UserContexts'
import {SetAdminError} from '../../Library/UserContexts'

//Images
import TooltipIcon from '../../Components/Images/Tooltip.svg'

//CSS
import './Locations.css'

export default function AddLocation(props) {

  //------------------------------------------------------
  //  Extract Props
  //------------------------------------------------------

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

    //State for show/hide duplicate location message
    const [hideDuplicateErrorMessage, setHideDuplicateErrorMessage] = useState(true);

  //------------------------------------------------------
  //  Define functions
  //------------------------------------------------------

    //Used to display tooltip for field label
    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        All booking emails will be directed to this email address.
      </Tooltip>
    );


  //------------------------------------------------------
  //  Event Handler (Form Submission)
  //------------------------------------------------------

    //Submit Form > Check for duplicates > Write to Firestore
    const handleFormSubmit = (e) =>{

      //This prevents the form from been submitted
      var preventSubmit = false;

      //Generate using location ID
      var locationid = "lc-" + Date.now()

      //Prepare Firestore Document Object
      const document = {
        "locationid": locationid,
        "locationname": e.target.locationname.value,
        "streetaddress": e.target.streetaddress.value,
        "city": e.target.city.value,
        "state": e.target.state.value,
        "postcode": e.target.postcode.value,
        "fulladdress": e.target.streetaddress.value + ", " + e.target.city.value + " " + e.target.state.value + " " + e.target.postcode.value,
        "partnername": e.target.partnername.value,
        "partneremail": e.target.partneremail.value,
        "hours":
        {
          "open": e.target.hoursOpen.value + ' ' + e.target.hoursOpenAMPM.value,
          "close": e.target.hoursClose.value + ' ' + e.target.hoursCloseAMPM.value 
        }
      }

      //Define list of queries for checking duplicate locations
      var queries = [
        ["locationname", "==", document.locationname],
        ["fulladdress", "==", document.fulladdress]
      ]
      
      //Check for duplicate locations
      CompoundQuery("locations", queries).then((results) => {
        //If duplicate locations exists > prevent form submission
        if(results.length > 0){
          setHideDuplicateErrorMessage(false)
          preventSubmit = true;

        } else{
          setHideDuplicateErrorMessage(true)
        }

        //If duplicate location does NOT exist > submit form and write to Firestore
        if(preventSubmit === false) {
          
          return WriteDocument('locations', document.locationid, document, true)
          //If success > show thank you message
          .then((results) =>{
            setRequestType('pending')
          })
        
        }
      })
      //Error > Show error page
      .catch((error) =>{
        setRequestType('failed')

        //Submit error to global store > This will be catured by ErrorHandler
        setUserError("Unable to add location.")
        setAdminError(`Add location form has failed, error: ${error}`)
      })

      //Prevent reload
      e.preventDefault();

    }

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    const textFieldValidation = "(^[A-Za-z0-9/,. ]+$)"

    return (
      <div className="Form">
        {/* Form Header */}
        <div className='Form-Header'>
            Add Location
        </div>

        {/* Duplicate Location Error Message */}
        <div hidden={hideDuplicateErrorMessage}>
            <center><p style={{color:"red", lineHeight: "1.7"}}>This location already exists. Please enter a different location name and address.</p></center>
        </div>

        {/* Add Location Form */}
        <Form onSubmit={handleFormSubmit}>
          
          {/* Location Name */}
          <Form.Group className="mb-3" controlId="locationname">
              <div className="Label-Field-Title">
                  <Form.Label>Location</Form.Label>
              </div>
              <Form.Control required type="text" pattern={textFieldValidation} placeholder="" />
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-3" controlId="streetaddress">
                <div className="Label-Field-Title">
                    <Form.Label>Address</Form.Label>
                </div>
                <Form.Control required type="text" pattern={textFieldValidation} placeholder="" />
          </Form.Group>

          {/* City, State, Postcode */}
          <Row>

            {/* City */}
            <Form.Group className="mb-3" as={Col} controlId="city">
                <div className="Label-Field-Title">
                    <Form.Label>City</Form.Label>
                </div>
                <Form.Control required type="text" pattern={textFieldValidation} placeholder="" />
            </Form.Group>

            {/* State */}
            <Form.Group className="mb-3" as={Col} controlId="state">
              <div className="Label-Field-Title">
                  <Form.Label>State</Form.Label>
              </div>
              <Form.Select required defaultValue="NSW">
                <option value="ACT">ACT</option>
                <option value="NSW">NSW</option>
                <option value="NT">NT</option>
                <option value="QLD">QLD</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="VIC">VIC</option>
                <option value="WA">WA</option>
              </Form.Select>
            </Form.Group>

            {/* Postcode */}
            <Form.Group className="mb-3" as={Col} controlId="postcode">
              <div className="Label-Field-Title">
                  <Form.Label>Postcode</Form.Label>
              </div>
              <Form.Control required type="text" placeholder="" pattern="^([0-9]{4})$" title="Please enter a valid 4 digit postcode."/>
            </Form.Group>
            
          </Row>

          {/* Operating Hours */}
          <div className="Label-Field-Title">
              <Form.Label>Operating Hours</Form.Label>
          </div>
          <Row>
            <Col xs={2}>
              <Form.Group className="mb-3" controlId="hoursOpen">
                <Form.Control className="float-start" controlId="open" type="text" placeholder="_ _ : _ _"
                              defaultValue="09:00"
                              pattern="^(0[1-9]|1[0-9]|2[0-3]):([0-4][0-9]|5[0-9])$" 
                              title="Please enter a time in this format 23:59" 
                              required />
              </Form.Group>
            </Col>

            <Col xs="auto">
              <Form.Group className="mb-3" controlId="hoursOpenAMPM">
                <Form.Select required>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={2}>
              <Form.Group className="mb-3" controlId="hoursClose">
                <Form.Control className="float-start" controlId="open" type="text" placeholder="_ _ : _ _" 
                              defaultValue="17:00"
                              pattern="^(0[1-9]|1[0-9]|2[0-3]):([0-4][0-9]|5[0-9])$" 
                              title="Please enter in this format 23:59"
                              required />
              </Form.Group>
            </Col>

            <Col xs="auto">
              <Form.Group className="mb-3" controlId="hoursCloseAMPM">
                <Form.Select required>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Form.Select>
                </Form.Group>
            </Col>
          </Row>

          {/* Partner Details */}
          <Row>
            {/* Partner Name */}
            <Col xs="auto">
              <Form.Group className="mb-3" controlId="partnername">
                <div className="Label-Field-Title">
                    <Form.Label>Partner</Form.Label>
                </div>
                <Form.Select required>
                  <option hidden value="">Select Partner</option>
                  <option value="WOTSO">WOTSO</option>
                  <option value="CreativeCubes.Co">CreativeCubes.Co</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Partner Email */}
            <Col xs={4}>
              <Form.Group className="mb-3" controlId="partneremail">
                <div className="Label-Field-Title">
                    <Form.Label>Partner Email</Form.Label>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <img src={TooltipIcon} alt="Tooltip" style={{margin: "0px 10px"}}></img>
                    </OverlayTrigger>
                </div>
                <Form.Control required type="email" placeholder="" defaultValue={getContextUser.emailaddress}/>
              </Form.Group>
            </Col>
          </Row>

          <br></br>

          {/* Submit Button */}
          <Button className="Submit-Button float-none" style={{fontWeight: "600"}} variant="dark" type="submit">
              Submit
          </Button>

          {/* Cancel Button */}
          <Button className="Submit-Button float-none" style={{fontWeight: "600", border: "2px solid black", backgroundColor: "white", color: "black"}} variant="light" onClick={() => setRequestType("pending")}>
              Cancel
          </Button>
          
        </Form>
      </div>
    )

    //------------------------------------------------------
}

