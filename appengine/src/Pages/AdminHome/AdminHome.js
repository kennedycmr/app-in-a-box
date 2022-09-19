//------------------------------------------------------
//  Locations Page
//------------------------------------------------------

//Libraries
import React from 'react'
import {Tabs, Tab} from "react-bootstrap"

//Pages
import Locations from '../Locations/Locations'
import Reports from '../Reports/ExportBookings'
import Administrators from '../Administrators/Administrators'

//Images
import Logo from '../../Components/Images/Logo.png'

//CSS
import './AdminHome.css'

export default function AdminHome() {

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    return (
      <div className='Admin-Home'>

        {/* Page Header */}
        <div className='Admin-Header'>
            <img className="Admin-Logo" src={Logo} alt="The Local Office"></img>
            <h2>App in a Box</h2>
            
        </div>

        {/* Tabular View */}
        <div className="Admin-Content">
            <Tabs defaultActiveKey="locations" transition={false} id="admin-page" className="mb-3">
                <Tab tabClassName='Tab' eventKey="locations" title="Locations">
                  <Locations></Locations>
                </Tab>

                <Tab tabClassName='Tab' eventKey="users" title="Administrators">
                  <Administrators></Administrators>
                </Tab>

                <Tab tabClassName='Tab' eventKey="reports" title="Reports">
                  <Reports></Reports>
                </Tab>
            </Tabs>
        </div>
        
      </div>
    
    )
  //------------------------------------------------------
}