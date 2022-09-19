//================================================================
//  Component: Form of component
//================================================================

//  Purpose: This is the new event form

//  Properties:
//    - name = {A string, this is the persons name}
//    - message = {A string, a short message}

//  Form:
//    <Form
//      name={'Mark Bennett'}
//      message={'stop breaking stuff!'}
//    ></Form>    

//================================================================


//Libraries
import React, { useContext, useState } from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

//Contexts
import {SetError, GetUser} from '../../Library/UserContexts';

//Components
import PageResponse from '../../Components/PageResponse/PageResponse';
import MultiLineInput from '../../Components/MultiLineInput/MultiLineInput';

//Functions
import UploadFile from '../../Library/UploadFile';
import WriteDocument from '../../Library/WriteDocument';

//Images
import BackButton from '../../Components/Images/Back-button-blue.png';
import WhiteButton from '../../Components/Images/Back-button.png';
import SuccessBoat from '../../Components/Images/McSwifty.png';

//CSS
import './EventForm.css';

export default function EventForm() {

  //------------------------------------------------------
  //  react router
  //------------------------------------------------------
  
    const navigate = useNavigate();

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const setError = useContext(SetError);

    const getUser = useContext(GetUser);
 
  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------
     
    //Page status > 'onload', 'pending', 'create', 'view', 'error-fatal'
    const [requestType, setRequestType] = useState('onload');

    //Used to store event start date and end date
    function GetTomorrow(){

      let today = new Date();
      today = new Date(today.setHours(today.getHours() + 24));
      today = today.toLocaleDateString().split('/');
      return `${today[2]}-${today[1]}-${today[0]}`;

    }
    const [startDate, setStartDate] = useState(GetTomorrow());
    const [endDate, setEndDate] = useState(GetTomorrow());

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------
 
    //This function handles the conversion of a date, time into a different timezone
    function TimeZoneConversion(dateString, timeString, timezoneString){

      //Create a new startDate object with the correct timeZone!
      const startDateObject = new Date(dateString);

      //Extract the hours, minutes
      const startHour = timeString.split(':')[0];
      const startMinutes = timeString.split(':')[1];

      //Add the hours and minutes to 'startDateObject'
      startDateObject.setHours(parseInt(startHour));
      startDateObject.setMinutes(parseInt(startMinutes));

      //Figure out the timezone offset in hours
      const utcTimeOffset = (startDateObject.getTimezoneOffset()) / 60;

      //Add timezone offset 'America/New_York'
      if (timezoneString === 'America/New_York'){

        //Apply the UTC and timezone offset
        return startDateObject.setHours((startDateObject.getHours() + 4) - utcTimeOffset);
        
      }

      //Add timezone offset 'Australia/Sydney'
      if (timezoneString === 'Australia/Sydney'){

        //Apply the UTC and timezone offset
        return startDateObject.setHours((startDateObject.getHours() - 10) - utcTimeOffset);
      
      }

      if (timezoneString === 'United Kingdom'){

        //Apply the UTC and timezone offset
        return startDateObject.setHours((startDateObject.getHours() - 1) - utcTimeOffset);
      
      }

    };

    //Sumbit form 
    function HandleFormSubmit(event){

      // Disables enter key
      if (event.keyCode === 13) {
        return;
      };

      //Handle field: status - set to active unless toggle clicked
      let status = 'active'
      if (event.target.status.checked){
          status = 'hidden'
      }

      //Set requestType to pending
      setRequestType('pending');
   
      //TimeZone converstion
      const startDateEpoc = TimeZoneConversion(startDate, event.target.starttime.value, event.target.timezone.value);

      //Create documentId and get uploaded ics file
      const documentId = `evt-${Date.now()}`;
      const file = event.target.formFile.files[0];

      //upload file to storage bucket folder/filename - coming from eventid
      UploadFile(`events/${documentId}.ics`, file).then((icsurl)=>{

        const document = {
          'eventid': documentId,
          'name': event.target.name.value,
          'description': event.target.description.value,
          'location': event.target.location.value,
          'startdate': startDate,
          'enddate': endDate,
          'starttime': event.target.starttime.value,
          'endtime': event.target.endtime.value,
          'timezone': event.target.timezone.value,
          'startepoch': startDateEpoc,
          'status': status,
          'totalseats': event.target.totalseats.value,
          'availableseats': event.target.totalseats.value, 
          'icsurl': icsurl,
          'eventadmins': [
            getUser?.emailaddress
          ],
        };

        //collection, documentId-saveDocument, document, merging - false - don't overwrite
        //WriteDocument creates the document and promise
        //.then allows to resolve the promise 
        return WriteDocument('events', documentId, document, false).then(()=>{

          setRequestType('view');

        });

      }).catch((error)=>{

        setRequestType('error-fatal');
        //Submit error to global store > This will be catured by ErrorHandler
        setError(`Creating an event has failed, error: ${error}`);

      });

      // Default - reloads. This prevents reloading of the page
      event.preventDefault();

    }

  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <PageResponse
      requestType={requestType}
      // This is the form page onload
      pageOnload={[
        <div className='EventForm-Container'>

          <div className='EventForm-BackButton'> 
            <img src={BackButton} alt="Back-Button" onClick={() => navigate("/events")}></img>
          </div>

          <div className='EventForm-Title'> Create an Event </div>

          <div className='EventForm-Body'>
            <Form onSubmit={(event) => HandleFormSubmit(event)}>
              <h6>Event Name</h6>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Control required type='text' placeholder='Enter the event name'></Form.Control>
                </Form.Group>

              <h6>Description</h6>
              <MultiLineInput
                name='description'
                setPlaceHolder='Enter the description of the event'
                required={true}
              ></MultiLineInput>

              <h6>Location</h6>
                <Form.Group className='mb-3' controlId='location'>
                    <Form.Control required type='text' placeholder=
                    'If it is a virtual event, enter Online Event <Region>'></Form.Control>
                </Form.Group>
              
              <Row>
                <h6>Start Date</h6>
              </Row>

              <Row>
                {/* Start Date */}
                <Col xs={2}>
                  <Form.Group className="mb-3" controlId="startdate">
                    <div>
                      <Form.Control 
                        required
                        controlId="startdate"
                        type="date"
                        defaultValue={GetTomorrow()}
                        min={GetTomorrow()}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        >
                      </Form.Control>
                    </div>
                  </Form.Group>
                </Col>

                {/* Start Time */}
                <Col xs="auto">
                  <Form.Group className="mb-3" controlId="starttime">
                    <Form.Control className="float-start" controlId="starttime" type="text" placeholder="_ _ : _ _"
                                  defaultValue="09:00"
                                  pattern="^(0[1-9]|1[0-9]|2[0-3]):([0-4][0-9]|5[0-9])$" 
                                  title="Please enter in 24hr format e.g. 09:59" 
                                  required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <h6>End Date</h6>
              </Row>
              <Row>
                {/* End Date */}
                <Col xs={2}>
                  <Form.Group className="mb-3" controlId="enddate">
                  <div>
                    <Form.Control 
                      required
                      controlId="enddate"
                      type="date"
                      defaultValue={GetTomorrow()}
                      min={GetTomorrow()}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      >
                    </Form.Control>
                  </div>
                  </Form.Group>
                </Col>
                
                {/* End Time */}
                <Col xs="auto">
                  <Form.Group className="mb-3" controlId="endtime">
                    <Form.Control className="float-start" controlId="endtime" type="text" placeholder="_ _ : _ _" 
                                  defaultValue="17:00"
                                  pattern="^(0[1-9]|1[0-9]|2[0-3]):([0-4][0-9]|5[0-9])$" 
                                  title="Please enter in 24hr format e.g. 17:59"
                                  required />
                  </Form.Group>
                </Col>
              </Row>

              <h6>Timezone</h6>
                <Form.Select required id='timezone'>
                  <option value="Australia/Sydney">Sydney/Australia</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="United Kingdom">United Kingdom</option>
                </Form.Select>
              <br></br>
              <h6>Total Seats</h6>
                <Form.Group className='mb-3' controlId='totalseats'>
                    <Form.Control required type='number' placeholder='Enter the total amount of seats allowed'></Form.Control>
                </Form.Group>

              <h6>Upload your ics file</h6>
              <Form.Group controlId='formFile' className='mb-3'>
                  <Form.Control type='file'/>
              </Form.Group>

              <h6>Hide Event</h6>
                <Form.Check
                type="switch"
                id="status"
                label="Selecting this will hide your event" />
              <br></br>
              <button className='Primary-Button' type='submit'> Next </button>

            </Form>
          </div>
        </div>
      ]}

      // This is the success page
      pageView={[
        <div className='FormSuccess-Container'>
         <div className='FormSuccess-Header'>      
            <div className='FormSuccess-Title'> Event Created </div>
            <div className='FormSuccess-BackButton'> 
                <img src={WhiteButton} alt="White-Back-Button" onClick={() => navigate("/events")}></img>
            </div>
          </div> 
            
          <div className='FormSuccess-Body'>
            <img src={SuccessBoat} alt="Success-Boat" style={{height:350}}/>  
            <br></br>
            <h2> All Aboard!</h2>
            <h4> Your event is now created!</h4>
            <p>It will appear as Upcoming in the Events tab.</p>
          </div>
        </div>
      ]}
    ></PageResponse>
  )
}
