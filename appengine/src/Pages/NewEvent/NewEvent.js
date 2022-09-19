//Libraries
import React, { useState, useEffect, useContext } from 'react';

//Contexts
import {GetUser} from '../../Library/UserContexts';

//Components
import PageResponse from '../../Components/PageResponse/PageResponse'; 
import EventForm from './EventForm';

//Functions

//Images

export default function NewEvent() {

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
  const getUser = useContext(GetUser);

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

  //State used to determine current view on this page > 'pending', 'onload', 'view', 'create', 'edit', 'delete', 'manage'
    const [requestType, setRequestType] = useState('pending')

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    useEffect(() => {
        // Condition: User must not be undefined for this useeffect to run
        if(getUser === undefined) return;

        if(getUser?.roles?.isAdmin) return setRequestType('view');

        if(getUser?.roles?.isAdmin === false) return setRequestType('onload');
    },[getUser])

  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <PageResponse
      requestType={requestType}
   
      pageOnload={[  
        <div>
            Access Denied
        </div>
      ]}

      pageView={[
        <EventForm></EventForm>
      ]}
    ></PageResponse>
  )
}
