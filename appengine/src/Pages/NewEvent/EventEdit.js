//Libraries
import React, { useContext, useState, useEffect } from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";

//Contexts
import {SetError} from '../../Library/UserContexts';

//Components
import PageResponse from '../../Components/PageResponse/PageResponse';
import MultiLineInput from '../../Components/MultiLineInput/MultiLineInput';

//Functions
import WriteDocument from '../../Library/WriteDocument';

//Images
import BackButton from '../../Components/Images/Back-button-blue.png';
import WhiteButton from '../../Components/Images/Back-button.png';
import SuccessBoat from '../../Components/Images/McSwifty.png';

//CSS
import './EventForm.css'
import GetDocument from '../../Library/GetDocument';

export default function EventEdit() {

  //------------------------------------------------------
  //  react router
  //------------------------------------------------------
  
    const navigate = useNavigate();
    const{eventid} = useParams();

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const setError = useContext(SetError);
 
  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------
     
    //Page status > 'pending', 'onload', 'create', 'view', 'error-fatal'
    const [requestType, setRequestType] = useState('pending');

    //Holds value of selected event
    const [currentEvent, setCurrentEvent] = useState();

    //Used to store event start date and end date
    var today = new Date().toISOString().slice(0, 10);

    const [startDate, setStartDate] = useState(today);

    const [endDate, setEndDate] = useState(today);

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------
 
    //Sumbit form 
    function HandleFormSubmit(event){

      // Disables enter key
      if (event.keyCode === 13) {
        return;
      };

      setRequestType('pending');

      //Handle field: status - set to active unless toggle clicked
      let status = 'active'
      if (event.target.status.checked){
        status = 'hidden'
      }

      // //Set requestType to pending
      // setRequestType('pending');

      const document = {
        'description': event.target.description.value,
        'status': status,
      };

      //WriteDocument updates the document .then allows to resolve the promise 
      WriteDocument('events', currentEvent.eventid, document, true).then(()=>{

        setRequestType('view');

      }).catch((error)=>{

        setRequestType('error-fatal');
        //Submit error to global store > This will be captured by ErrorHandler
        setError(`Updating an event has failed, error: ${error}`);

      });

      // Default - reloads. This prevents reloading of the page
      event.preventDefault();

    }

    //Allows toggle to be edited
    function CheckBoxHandler(value){

      if (value === 'hidden'){
        
          return true;

      } else if (value === 'active'){
        
          return false;

      } else {

          return false;
      
      }
  }

  //------------------------------------------------------
  //  useEffect
  //------------------------------------------------------

    useEffect(()=>{
      if(eventid === undefined) return;
      
      GetDocument('events', eventid).then((event)=>{

        setCurrentEvent(event);
        setRequestType('onload');
        
      }).catch((error)=>{

        setError(error)
        setRequestType('error-fatal');
        
      })

    },[eventid, setError])

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
            <img src={BackButton} alt="Back-Button" onClick={() => navigate('/events')}></img>
          </div>

          <div className='EventForm-Title'> Edit an Event </div>

          <div className='EventForm-Body'>
            <Form onSubmit={(event) => HandleFormSubmit(event)}>
              <h6>Event Name</h6>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Control required type='text' defaultValue={currentEvent?.name} disabled></Form.Control>
                </Form.Group>

              <h6>Description</h6>
                <MultiLineInput
                  name='description'
                  setDefaultValue={currentEvent?.description}
                  required={true}
                ></MultiLineInput>                          

              <h6>Location</h6>
                <Form.Group className='mb-3' controlId='location'>
                    <Form.Control required type='text' defaultValue={currentEvent?.location} disabled></Form.Control>
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
                        controlId="startdate"
                        type="date"
                        defaultValue={currentEvent?.startDate}
                        min={today}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled
                        >
                      </Form.Control>
                    </div>
                  </Form.Group>
                </Col>

                {/* Start Time */}
                <Col xs="auto">
                  <Form.Group className="mb-3" controlId="starttime">
                    <Form.Control className="float-start" controlId="starttime" type="text" placeholder="_ _ : _ _"
                                  defaultValue={currentEvent?.starttime}
                                  pattern="^(0[1-9]|1[0-9]|2[0-3]):([0-4][0-9]|5[0-9])$" 
                                  title="Please enter in 24hr format e.g. 09:59" 
                                  disabled />
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
                      disabled
                      controlId="enddate"
                      type="date"
                      defaultValue={currentEvent?.enddate}
                      min={today}
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
                                  defaultValue={currentEvent?.endtime}
                                  pattern="^(0[1-9]|1[0-9]|2[0-3]):([0-4][0-9]|5[0-9])$" 
                                  title="Please enter in 24hr format e.g. 17:59"
                                  disabled />
                  </Form.Group>
                </Col>
              </Row>

              <h6>Timezone</h6>
                <Form.Select required id='timezone' defaultValue={currentEvent?.timezone} disabled>
                  <option value="Australia/Sydney">Sydney/Australia</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="United Kingdom">United Kingdom</option>
                </Form.Select>
              <br></br>
              <h6>Total Seats</h6>
                <Form.Group className='mb-3' controlId='totalseats'>
                    <Form.Control required type='number' defaultValue={currentEvent?.totalseats} disabled></Form.Control>
                </Form.Group>

              <br></br>
              <h6>Upload your ics file</h6>
              <Form.Group controlId='formFile' className='mb-3'>
                <Form.Control required={true} type='file'defaultValue={currentEvent?.formFile} disabled/>
              </Form.Group>
 
              <br></br>
              <h6>Hide Event</h6>
                <Form.Check
                type="switch"
                id="status"
                label="Selecting this will hide your event"
                defaultChecked={CheckBoxHandler(currentEvent?.status)} />
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
            <div className='FormSuccess-Title'> Event Updated </div>
            <div className='FormSuccess-BackButton'> 
                <img src={WhiteButton} alt="White-Back-Button" onClick={() => navigate("/events")}></img>
            </div>
          </div> 
            
          <div className='FormSuccess-Body'>
            <img src={SuccessBoat} alt="Success-Boat" style={{height:350}}/>  
            <br></br>
            <h2> All Aboard!</h2>
            <h4> Your event has been edited!</h4>
          </div>
        </div>
      ]}
    ></PageResponse>
  )
}
