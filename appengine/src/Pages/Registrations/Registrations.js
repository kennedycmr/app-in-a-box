//Libraries
import React, { useState, useEffect, useContext } from 'react'
import Table from 'react-bootstrap/Table'
import { CSVLink } from "react-csv";

//Contexts
import {GetUser, SetError} from '../../Library/UserContexts'

//Components
import PageResponse from '../../Components/PageResponse/PageResponse.js'

//Functions
import QueryDocument from '../../Library/QueryDocument'

//Images

//CSS
import './Registrations.css'
import RegistrationsTable from './RegistrationsTable'


export default function Registrations() {

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to determine current view on this page > 'onload'(loading), 'view'(no records), 'create'(success), 'failed'
    const [requestType, setRequestType] = useState('onload');

    //Holds registration data
    const [registrations, setRegistrations] = useState([]);

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
    const getUser = useContext(GetUser);
    
    const setError = useContext(SetError);

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //[] = onload - component mounts once (Without this, the page will refresh)
    useEffect(() =>{

      //Conditions
      if (getUser === undefined) return;

      //Get Registrations
      const query = [
        ['useremail', '==', getUser?.emailaddress],
      ]

      QueryDocument('registrations', query).then((registrations) =>{
        if (registrations.length > 0){

          setRegistrations(registrations);
          setRequestType('create');

        } else {

          setRequestType('view');

        }

      }).catch((error) =>{
        //Page response error failed
        setRequestType('failed');
        setError("This error has occured in the registrations collection", error);
        console.log("error", error);
      });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------
      
  return (
    <PageResponse
      requestType={requestType}
      pageOnload={[
        <div className='Registrations-Container'>
        <div className='Registrations-Header'>
          <div className='Registrations-Title'>
              <h2>Registrations List</h2>
          </div>
        </div>

        <div className='Registrations-Body'>
          <Table className='table table-bordered'>
            <thead>
              <tr>
                <th>Event Date</th>
                <th>Event ID</th>
                <th>Event Name</th>
                <th>Email Address</th>
              </tr>
              <tr>
                Loading...
              </tr>
            </thead>
          </Table>
        </div>
      </div>
      ]}

      pageView={[
        <div className='Registrations-Container'>
        <div className='Registrations-Header'>
          <div className='Registrations-Title'>
              <h2>Registrations List</h2>
          </div>
        </div>

        <div className='Registrations-Body'>
          <Table className='table table-bordered'>
            <thead>
              <tr>
                <th>Event Date</th>
                <th>Event ID</th>
                <th>Event Name</th>
                <th>Email Address</th>
              </tr>
              <tr>
                No Records
              </tr>
            </thead>
          </Table>
        </div>
      </div>
      ]}

      pageCreate={[  
        <div className='Registrations-Container'>
          <div className='Registrations-Header'>
            <div className='Registrations-Title'>
                <h2>Registrations List</h2>
            </div>
            <CSVLink data={registrations} style={{width: 'fit-content'}}>
              <button className='Primary-Button'>
                Download to CSV
              </button>
            </CSVLink>
          </div>

          <div className='Registrations-Body'>
            <RegistrationsTable setRegistrations={setRegistrations} registrations={registrations}> </RegistrationsTable>
          </div>
        </div>
      ]}
    ></PageResponse>
  )
}
