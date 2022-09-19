//Libraries
import React, {useContext} from 'react'
import Table from 'react-bootstrap/Table'
import { GetUser } from '../../Library/UserContexts'
//Contexts

//Components
import MultiLineInput from '../../Components/MultiLineInput/MultiLineInput'

//Functions
import WriteDocument from '../../Library/WriteDocument'

//Images
import BackButton from '../Images/Back-button.png'

//CSS
import './RegistrationDetail.css'


export default function WaitlistRegistration(props) {

    //------------------------------------------------------
    //  Extract Props
    //------------------------------------------------------

        const selectedEvent = props.selectedEvent
        const setSelectedEvent = props.setSelectedEvent
        const setRequestType = props.setRequestType
        const requestType = props.requestType
        
    //------------------------------------------------------
    //  useContext
    //------------------------------------------------------

        const getUser = useContext(GetUser)

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

    //This function writes to the firebase database
    function WritesToDB(status){
        //This generates a unique timestamp of when they create the registration document
        const document = {
            "status": status,
        }

        //This function creates/writes a firestore document. True = updates document to overwrite field
        WriteDocument('registrations', selectedEvent.registrationid, document, true)
        //Tell PageResponse to show a pending screen after user clicks the button while it writes to the DB
            .then(()=>{
                setRequestType ('pending')
            })
            .catch((error) =>{
                setRequestType ('failed')
            })
    } 

    function NavHandler(){
        setSelectedEvent(selectedEvent)
        setRequestType(requestType)
      }
  

  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <div className='RegistrationDetail-Container'>
        <div className='RegistrationDetail-Header'> 
            <div className='RegistrationDetail-Title'> {selectedEvent?.name} </div>
            <div className='RegistrationDetail-BackButton'> 
                <img src={BackButton} alt="Back-Button" onClick={() => NavHandler()}></img>
            </div>
        </div>
        
        <div className='RegistrationDetail-Body'>   
            <div className='RegistrationDetail-Body-Description'> 
                <MultiLineInput
                  setDefaultValue={selectedEvent?.description}
                  setDisabled={true}
                ></MultiLineInput> 
            </div>
            <div className='RegistrationDetail-Body-Table'>
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
                </thead>
            </Table>
            <button className='Primary-Button' onClick={() => WritesToDB('cancelled')}> Cancel </button>
            </div>
        </div>
    </div>
  )
}

