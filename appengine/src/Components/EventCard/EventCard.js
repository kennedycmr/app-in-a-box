//================================================================
//  Component: Event Card
//================================================================

//  Purpose: This is the Event Card which appears on the Home page

//  Properties:
//    - selectedEvent = {object, the selected event}

//  Example:
//    <EventCard
//      eventobject = {eventobject}
//    ></EventCard>    

//================================================================

//Libraries
import React, {useContext}  from 'react'
import { useNavigate } from "react-router-dom";

//Contexts
import {GetUser} from '../../Library/UserContexts'

//Images
import EditButton from '../Images/Edit_Button.svg'

//CSS
import './EventCard.css'


export default function EventCard(props) {

  //------------------------------------------------------
  //  react router
  //------------------------------------------------------
  
    const navigate = useNavigate();

  //------------------------------------------------------
  //  Extract Props
  //------------------------------------------------------

    const eventobject = props.eventobject

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
    const getUser = useContext(GetUser);

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------

    //This function converts the date into the format according to wireframes
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


    //This function checks if users are admins and if they are, the edit button appears
    function EventAdmins(){
      if(getUser === undefined) return;
      if(eventobject === undefined) return;

      if(eventobject?.eventadmins?.indexOf(getUser.emailaddress) > -1){
        return <img src={EditButton} alt="Edit" onClick={() => navigate(`/eventedit/${eventobject.eventid}`)}></img>
      }

    } 

    function HiddenLabel(){
      if(eventobject === undefined) return;
      if(eventobject.status !== 'hidden') return;

      return <label  className='Event-HiddenLabel'> Hidden </label>
    }
  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <div className='Events-EventCard-Container'>
      <div className='Events-AdminButton'> 
        {EventAdmins()}
      </div>
      <div className='Events-EventCard' onClick={()=> navigate(`/eventdetail/${eventobject.eventid}`)}>
        <div className='EventCard-Title'>{eventobject?.name}</div>
        <br></br>
        <h5>{DateHandler(eventobject?.startdate)}</h5>
        <h5> {StartTimeEndTime(eventobject?.starttime)} - {StartTimeEndTime(eventobject?.endtime)} </h5>
        <p> {eventobject.timezone} </p>
        {HiddenLabel()}
      </div>
    </div>
    )
}
