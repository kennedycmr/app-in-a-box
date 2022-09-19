//Libraries
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

//Contexts
import {GetUser, SetError} from '../../Library/UserContexts';

//Components
import PageResponse from '../../Components/PageResponse/PageResponse.js';
import EventCard from '../../Components/EventCard/EventCard';
import EventDetail from '../../Components/EventDetail/EventDetail';
import EventEdit from '../NewEvent/EventEdit';

//Functions
import QueryDocument from '../../Library/QueryDocument';

//Images
// import SearchIcon from '../../Components/Images/Icon_Search_Grey.svg'

//CSS
import './Events.css'


export default function Events() {

  //------------------------------------------------------
  //  react router
  //------------------------------------------------------
  
    const navigate = useNavigate();

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
    const getUser = useContext(GetUser);
  
    const setError = useContext(SetError);

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to determine current view on this page > 'pending', 'onload', 'view', 'create', 'edit', 'delete', 'manage'
    const [requestType, setRequestType] = useState('pending')

    //State used to store list of all events
    const [events, setEvents] = useState([]);

    //State used to show selected event
    const [selectedEvent, setSelectedEvent] = useState();

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------

    // Show 'New Event' button if the user is an Admin
    function HandleCreateEvent (roles){
      if (roles === undefined) return;
      if (roles.isAdmin){
        return <button className='Primary-Button' onClick={() => navigate("/newevent")}> New Event </button>
      }
    } 

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

      //When requestType changes > get list of all events
      useEffect(() => {
        if(requestType !== 'pending') return;

        //If user is undefined, don't run
        if(getUser === undefined) return;
        
        //Call the function and return a promise
          const activeEvents = QueryDocument('events', [
            ['status', '==', 'active'],
            ['startepoch', '>', Date.now()]
          ])

          const hiddenEvents = QueryDocument('events', [
            ['status', '==', 'hidden'],
            ['eventadmins', 'array-contains', getUser?.emailaddress],
            ['startepoch', '>', Date.now()]
          ]) 
         
         //Success > Load the page
         //Resolve the array of promises and get results  
         Promise.all([activeEvents, hiddenEvents]).then((results) =>{
            const activeArray = results[0]
            const hiddenArray = results[1]

            setEvents([...activeArray, ...hiddenArray])
            setRequestType('onload')          
          })

          //Error > show error page
          .catch((error) =>{
            setRequestType('error-fatal')

          //Submit error to global store > This will be catured by ErrorHandler
          setError(`GetCollection for events has failed, error: ${error}`)
          })

      },[requestType, getUser]) 

      // This useEffect is triggered when the user clicks on the event
      // If the page is pending don't run this useEffect 
      // if setselectedevent is undefined > then set requestType to onload and take the user home
      // else > set requestType to view the selected event
      useEffect(() => {
        if(requestType === 'pending') return;
        if(requestType === 'edit') return;

        if(selectedEvent === undefined) return setRequestType('onload');

        setRequestType('view')

      },[selectedEvent])
  
  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------
      
  return (
    <PageResponse
      requestType={requestType}
      //This is the home page
      pageOnload={[  
        <div className='Events-Container'>
          <div className='Events-Header'>
            <div className='Events-Title'>
                <h2>Upcoming Events</h2>
                {HandleCreateEvent(getUser?.roles)}
              </div>

              <div className='Events-Search'>
                {/* <form className='Searchbox'>
                  <img src={SearchIcon} alt='search-icon'></img>
                  <input></input>
                </form> */}
              </div>
          </div>

        <div className='Events-Body'>
          {events?.map((object)=>(
            <EventCard 
              setSelectedEvent={setSelectedEvent}
              eventobject={object}
              requestType={'view'}
              setRequestType={setRequestType}
              ></EventCard>
          ))
          }
        </div>
        </div>
      ]}

      //This is the Events Detail Page 
      pageView={[
        <EventDetail
          //This sets the EventCard to the selected event
          setSelectedEvent={setSelectedEvent}
          selectedEvent={selectedEvent}
        ></EventDetail>
      ]}

      pageEdit={[
        <EventEdit 
          currentEvent={selectedEvent}
          setRequestType={setRequestType}
        ></EventEdit>
      ]}
    ></PageResponse>
  )
}
