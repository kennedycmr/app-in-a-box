//================================================================
//  Component: ProductCard -- update this 
//================================================================

//  Purpose: This is the market place item on the home page

//  Properties:
//    - productid = {string, the unique product id}
//    - productname = {string, product name}
//    - icon = {string, file name of the icon}
//    - description = {string, product id description}
//      pricingamount={number, amount the product costs}
//      pricingcurrency={string, currency e.g 'AUD', 'USD', etc}
//      pricingfrequency={string, frequency of the cost 'weekly', 'monthly', etc}

//  Example:
//    <ProductCard
//      id={'pd-123'}
//      productname = {'product awesome pants'}
//      icon = {'icon.png'}
//      description={'The online collaborative whiteboard platform.'}
//      pricingamount={1.00}
//      pricingcurrency={'USD'}
//      pricingfrequency={'weekly'} 
//    ></ProductCard>    

//================================================================


//Libraries
import React, {useContext, useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table'
import { GetUser, SetError } from '../../Library/UserContexts'
import { useNavigate, useParams } from "react-router-dom";

//Components
import PageResponse from '../PageResponse/PageResponse'
import MultiLineInput from '../MultiLineInput/MultiLineInput'

//Functions
import WriteDocument from '../../Library/WriteDocument'
import QueryDocument from '../../Library/QueryDocument'

//Images
import BackButton from '../Images/Back-button.png'
import SuccessBoat from '../Images/McSwifty.png'

//CSS
import './EventDetail.css'
import GetDocument from '../../Library/GetDocument';


export default function EventDetail() {

  //------------------------------------------------------
  //  react router
  //------------------------------------------------------
  
        const navigate = useNavigate();
        const{eventid} = useParams();

    //------------------------------------------------------
    //  useContext
    //------------------------------------------------------

        const getUser = useContext(GetUser);
        const setError = useContext(SetError);

    //------------------------------------------------------
    //  useStates
    //------------------------------------------------------
        
        //State used to determine current view on this page > 'pending', 'onload', 'create', 'failed'
        const [pageStatus, setPageStatus] = useState('pending');
        
        const [regStatus, setRegStatus] = useState();

        const [selectedEvent, setSelectedEvent] = useState();

    //------------------------------------------------------
    //  Functions
    //------------------------------------------------------

    function DateHandler(value){
        if (value === undefined) return null;
        
        let date = new Date(value);
        date = date.toLocaleDateString('en-gb', { weekday:"long", month:"short", day:"numeric"}) 
  
        if (date === undefined) {
          return null;
        }
  
        else {
          return date;
        }
    }
    
    //This function extracts the time e.g. 09:00 is converted to 9:00 AM / 14:00 converts to 2:00 PM
    function StartTimeEndTime(timeString){
        if (timeString === undefined) return;

        const hours = parseInt(timeString.split(':')[0]);
        const minutes = timeString.split(':')[1];

        if (hours > 12){
            return `${hours - 12}:${minutes} PM`
        }
        else if (hours < 12){
            return `${hours}:${minutes} AM`
        }
    }

    //This function handles the submit button
    function HandleButton(availableseats){

        if(regStatus === 'registered' || regStatus === 'waitlisted'){
            return(
                <button className='Primary-Button' disabled> You are {regStatus} </button>
            )
        }

        if(availableseats > 0) {
            return(
                <button className='Primary-Button' onClick={() => WritesToDB("registered")}> Register Here </button>
            )
        }
        else if(availableseats <= 0) {
            return(
                <button className='Primary-Button' onClick={() => WritesToDB("waitlisted")}> Join Waitlist </button>
            )
        }
    }
    //This function handles the capacity reached label
    function HandleLabel(availableseats){
        if(availableseats > 0){
            return availableseats
        }
        else if(availableseats <= 0){
            return (
                <label className='EventDetail-Label'> Capacity Reached </label>
            )
        }
    }

    //This function writes to the firebase database
    function WritesToDB(status){
        //Tell PageResponse to show a pending screen after user clicks the button while it writes to the DB
        setPageStatus('pending') 
        //This generates a unique timestamp of when they create the registration document
        const date = Date.now()
        const id = `reg-${date}`
        const document = {
            "status": status,
            "eventid": selectedEvent?.eventid,
            "eventname": selectedEvent?.name,
            "registrationid": id,
            "startdate": `${selectedEvent?.startdate} ${selectedEvent?.starttime}`,
            "uid": getUser?.uid,
            "useremail": getUser?.emailaddress,
            "eventadmins": selectedEvent?.eventadmins,
        }

        //This function creates/writes a firestore document. False = does not allow documents to be overwritten 
        WriteDocument('registrations', id, document, false)
            .then((results) =>{
                if ('registered'=== status) {
                    setPageStatus('create')
                }
                if ('waitlisted'=== status) {
                    setPageStatus('edit')
                }
            })
            .catch((error) =>{
                setPageStatus('failed')
            })
    } 

  //------------------------------------------------------
  //  Use Effect
  //------------------------------------------------------

    //When the page first loads, get users 'registration' status
    useEffect(() =>{

        if(getUser === undefined) return;
        if(eventid === undefined) return;

        //Get the event and users registration status
        const event = GetDocument('events', eventid);
        const userRegistration = [
            ['useremail', '==', getUser.emailaddress],
            ['eventid', '==', eventid],
            ['status', '!=', 'cancelled']
        ];
        const registration = QueryDocument('registrations', userRegistration);
  
        Promise.all([event, registration]).then((results)=>{
            setSelectedEvent(results[0]);

            //User has some registrations > update the 'regStatus' useState
            if (results[1].length > 0) {
                setRegStatus(results[1][0].status);
            }

            setPageStatus('onload');

        }).catch((error)=>{
            setError(error)
            setPageStatus('failed');
        })
    
    },[getUser, eventid, setError]);

  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <PageResponse
      requestType={pageStatus}
      pageOnload={[  
        <div className='EventDetail-Container'>
            <div className='EventDetail-Header'> 
                <div className='EventDetail-Title'> {selectedEvent?.name} </div>
                <div className='EventDetail-BackButton'> 
                    <img src={BackButton} alt="Back-Button" onClick={() => navigate('/events')}></img>
                </div>
            </div>
            
            <div className='EventDetail-Body'>   
                <div className='EventDetail-Body-Description'> 
                    <MultiLineInput
                        setDefaultValue={selectedEvent?.description}
                        setDisabled={true}
                    ></MultiLineInput>
                </div>
                <div className='EventDetail-Body-Table'>
                <Table>
                    <thead>
                        <tr>
                            <th>Start Time</th>
                            <td>
                                <span>
                                    {DateHandler(selectedEvent?.startdate)} &nbsp; {StartTimeEndTime(selectedEvent?.starttime)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>End Time</th>
                            <td> 
                                <span>
                                {DateHandler(selectedEvent?.enddate)} &nbsp; {StartTimeEndTime(selectedEvent?.endtime)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>Timezone</th>
                            <td> {selectedEvent?.timezone} </td>
                        </tr>
                        <tr>
                            <th>Available Seats</th>
                            <td> {HandleLabel(selectedEvent?.availableseats)} </td>
                        </tr>
                    </thead>
                </Table>
                {HandleButton(selectedEvent?.availableseats)}
                </div>
            </div>
        </div>
      ]} 
    
        //This is the page register success screen after a user writes to the DB
        pageCreate={[
            <div className='EventRegister-Container'>
                <div className='EventRegister-Header'> 
                    <div className='EventRegister-Title'> {selectedEvent?.name} </div>
                <div className='EventRegister-BackButton'> 
                    {/* The useState says when the setSelectedEvent is undefined, take user back to home */}
                    <img src={BackButton} alt="Back-Button" onClick={() => navigate('/events')}></img>
                </div>
            </div>
            
            <div className='EventRegister-Body'>
                <img src={SuccessBoat} alt="success boat" style={{height:350}}/>  
                <h2> All Aboard! </h2>
                <br></br>
                <h4> Thank you for registering. </h4>
                <p> Click <a href={selectedEvent?.icsurl} rel='noreferrer' target='_blank'>here</a> to download the ics file and save it in your calendar. </p>
                <p> You can change or cancel your registration at any time in My Events. </p>
            </div>
            </div>
                
        ]}

        //This is the join waitlisted success screen after a user writes to the DB
        pageEdit={[
            <div className='EventWaitlist-Container'>
                <div className='EventWaitlist-Header'> 
                    <div className='EventWaitlist-Title'> {selectedEvent?.name} </div>
                <div className='EventWaitlist-BackButton'> 
                    {/* The useState says when the setSelectedEvent is undefined, take user back to home */}
                    <img src={BackButton} alt="Back-Button" onClick={() => navigate('/events')}></img>
                </div>
            </div>
            
            <div className='EventWaitlist-Body'>
                <img src={SuccessBoat} alt="success boat" style={{height:350}}/>  
                <h2> Docking Soon! </h2>
                <h4> You have been added to the waitlist. </h4>
                <p> You will be emailed when a free spot becomes available. </p>
            </div>
            </div>
                
        ]}
    ></PageResponse>
  )
}

