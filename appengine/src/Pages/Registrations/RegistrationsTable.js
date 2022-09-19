//================================================================
//  Component: Example of component
//================================================================

//  Purpose: This is the standard for creating a component

//  Properties:
//    - name = {A string, this is the persons name}
//    - message = {A string, a short message}

//  Example:
//    <Example
//      name={"Mark Bennett"}
//      message={"stop breaking stuff!"}
//    ></Example>    

//================================================================


//Libraries
import React, {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'

//Contexts

//Components

//Functions

//Images
import SortIcon from '../../Components/Images/Back-button-blue.png'

//CSS
import './Registrations.css'


export default function RegistrationsTable(props) {

  //------------------------------------------------------
  //  Extract Props
  //------------------------------------------------------

    const registrations = props.registrations

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to store registrations table data
    const [registrationsTableData, setRegistrationsTableData] = useState([]);

    //State used to determine if the table data is being sorted in ascending/descending order
    const [sortAscending, setSortAscending] = useState(true);
    const [sortStyle, setSortStyle] = useState('Registrations-Table-Sort-Asc');

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //Purpose - Sorts the registrations in ascending/descending order
    //References - https://bobbyhadz.com/blog/javascript-sort-array-of-objects-by-date-property 
    
    useEffect(() => {

      //Conditions
      if(registrations.length === 0) return;
      
      // ✅ Sort in Ascending order (low to high)
      if(sortAscending) {
        const sortedAsc = registrations.sort(
          (objA, objB) => new Date(objA.startdate) - new Date(objB.startdate),
        );

        setRegistrationsTableData(sortedAsc);
        setSortStyle('Registrations-Table-Sort-Asc');
      }

      // ✅ Sort in Descending order (high to low)
      else {
        const sortedDesc = registrations.sort(
          (objA, objB) => new Date(objB.startdate) - new Date(objA.startdate),
        );

        setRegistrationsTableData(sortedDesc);
        setSortStyle('Registrations-Table-Sort-Des')
      }

    // eslint-disable-next-line
    }, [sortAscending]);


  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <Table class='table table-bordered'>
      <thead>
      <tr>
          <th>
            Event Date
            <img className={sortStyle} src={SortIcon} alt='table-sort-icon' onClick={()=> setSortAscending(!sortAscending)}></img>
          </th>
          <th>Event ID</th>
          <th>Event Name </th>
          <th>Email Address</th>
      </tr>
      {
          registrationsTableData.map((object) =>(
          <tr>
              <td>{object?.startdate}</td>
              <td>{object?.eventid}</td>
              <td>{object?.eventname}</td>
              <td>{object?.useremail}</td>
          </tr>
          ))
      }
      </thead>
    </Table>
  )
}
