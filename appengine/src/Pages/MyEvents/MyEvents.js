//Libraries
import React, { useState, useEffect, useContext } from 'react'

//Contexts
import {GetUser, SetError} from '../../Library/UserContexts'

//Components
import PageResponse from '../../Components/PageResponse/PageResponse.js'
import EventCard from '../../Components/EventCard/EventCard'
import RegistrationDetail from '../../Components/RegistrationDetail/RegistrationDetail'
import WaitlistRegistration from '../../Components/RegistrationDetail/WaitlistRegistration'

//Functions
import QueryDocument from '../../Library/QueryDocument'
import GetDocument from '../../Library/GetDocument'

//Images
// import SearchIcon from '../../Components/Images/Icon_Search_Grey.svg'

//CSS
import './MyEvents.css'


export default function Events() {

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
    const getUser = useContext(GetUser);
    const setError = useContext(SetError);

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to determine current view on this page > 'pending', 'onload', 'view', 'create', 'edit',
    const [requestType, setRequestType] = useState('pending');

    //State used to store list of all events & selected event
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegistration, setSelectedRegistration] = useState();

    //State used to show selected event
    const [waitlists, setWaitlists] = useState([]);
    const [selectedWaitlist, setSelectedWaitlist] = useState();

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------

    function GetRegistered(){

      //------------------------------------------------------
      //  Step 1: Get the users registrations
      //------------------------------------------------------

      const userRegistration = [
        ['useremail', '==', getUser.emailaddress],
        ['status', '==', 'registered'],
      ];
      QueryDocument('registrations', userRegistration).then((registrations) =>{

        //Stop if the user doesnt have any registrations!
        if (registrations.length === 0){
          setRegistrations([]);
          setRequestType('onload');
          return;
        }; 

        //------------------------------------------------------
        //  Step 2: Foreach registration, get the events information 
        //    This code updates the key 'registrations.registeredevent' with an 'eventPromise'
        //------------------------------------------------------

        const eventsAndRegsPromise = registrations.map((registration) =>{
          
          const eventPromise = GetDocument('events', registration.eventid);
          return {
            'registrationid': registration.registrationid,
            'registeredevent': eventPromise,
          }

        });

        //------------------------------------------------------
        //  Step 3: Resolve all promises
        //    Use 'Promise.all' to fulfill each promise
        //    Use 'Promise.resolve' to resolve the promise held in 'registeredevent'
        //    Use the 'spread' operator to merge two objects and return
        //------------------------------------------------------

        return Promise.all(eventsAndRegsPromise.map(async(eventsAndRegs) =>{
      
          return Promise.resolve(eventsAndRegs.registeredevent).then((registeredevent) =>{

            return {
              ...registeredevent,
              'registrationid': eventsAndRegs.registrationid
            };

          });

          //------------------------------------------------------
          //  Step 4: Finally get the results
          //------------------------------------------------------

        })).then((registrations) =>{

          setRegistrations(registrations);
          setRequestType('onload');
          
        });
  
      }).catch((error) =>{

        setRequestType('error-fatal');
        setError(`GetCollection for events has failed, error: ${error}`);

      });

    }

    function GetWaitlisted(){

      //------------------------------------------------------
      //  Step 1: Get the users registrations
      //------------------------------------------------------

      const userRegistration = [
        ['useremail', '==', getUser.emailaddress],
        ['status', '==', 'waitlisted'],
      ];
      QueryDocument('registrations', userRegistration).then((registrations) =>{

        //Stop if the user doesnt have any registrations!
        if (registrations.length === 0){
          setWaitlists([]);
          setRequestType('onload');
          return;
        }; 

        //------------------------------------------------------
        //  Step 2: Foreach registration, get the events information 
        //    This code updates the key 'registrations.registeredevent' with an 'eventPromise'
        //------------------------------------------------------

        const eventsAndRegsPromise = registrations.map((registration) =>{
          
          const eventPromise = GetDocument('events', registration.eventid);
          return {
            'registrationid': registration.registrationid,
            'registeredevent': eventPromise,
          }

        });

        //------------------------------------------------------
        //  Step 3: Resolve all promises
        //    Use 'Promise.all' to fulfill each promise
        //    Use 'Promise.resolve' to resolve the promise held in 'registeredevent'
        //    Use the 'spread' operator to merge two objects and return
        //------------------------------------------------------

        return Promise.all(eventsAndRegsPromise.map(async(eventsAndRegs) =>{
      
          return Promise.resolve(eventsAndRegs.registeredevent).then((registeredevent) =>{

            return {
              ...registeredevent,
              'registrationid': eventsAndRegs.registrationid
            };

          });

          //------------------------------------------------------
          //  Step 4: Finally get the results
          //------------------------------------------------------

        })).then((registrations) =>{

          setWaitlists(registrations);
          setRequestType('onload');

        });
  
      }).catch((error) =>{

        setRequestType('error-fatal');
        setError(`GetCollection for events has failed, error: ${error}`);

      });

    }

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //Onload > Get the uses registrations and events
    useEffect(() => {

      //Conditions
      if (getUser === undefined) return;

      if (requestType !== 'pending') return;

      GetRegistered();
      GetWaitlisted();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[getUser, requestType]);

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------
      
  return (
    <PageResponse
      requestType={requestType}
      pageOnload={[  
        <div className='MyEvents-Container'>

          <div className='MyEvents-Registered-Header'>
            <div className='MyEvents-Title'>
                <h2>Registered Events</h2>
            </div>

              <div className='MyEvents-Search'>
                {/* <form className='Searchbox'>
                  <img src={SearchIcon} alt='search-icon'></img>
                  <input></input>
                </form> */}
              </div>
          </div>

          <div className='MyEvents-Registered-Body'>
            {
              registrations?.map((object)=>(
                <EventCard 
                  requestType={'view'}
                  setRequestType={setRequestType}
                  setSelectedEvent={setSelectedRegistration}
                  eventobject={object}>
                </EventCard>
              ))
            }
          </div>

          <div className='Waitlist-Title'>
              <h2>Waitlisted Events</h2>
          </div>
          <div className='MyEvents-Waitlisted-Body'>
            {
              waitlists?.map((object)=>(
                <EventCard
                  requestType={'create'} 
                  setRequestType={setRequestType}
                  setSelectedEvent={setSelectedWaitlist}
                  eventobject={object}>
                </EventCard>
              ))
            }
          </div>
        </div>
      ]}

      // Registered Events Detail
      pageView={[
        <RegistrationDetail
          //This sets the EventCard to the selected event
          requestType={'pending'}
          setRequestType={setRequestType}
          setSelectedEvent={setSelectedRegistration}
          selectedEvent={selectedRegistration}
        ></RegistrationDetail>
      ]}

      // Waitlisted Events Detail
      pageCreate={[
        <WaitlistRegistration
          //This sets the EventCard to the selected event
          requestType={'pending'}
          setRequestType={setRequestType}
          setSelectedEvent={setSelectedWaitlist}
          selectedEvent={selectedWaitlist}
        ></WaitlistRegistration>
      ]}
    ></PageResponse>
  )
}
