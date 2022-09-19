//------------------------------------------------------
//  Events App
//  Product Owner: Scott Wrigley
//  Developers: Nisa Thaensa, Mark Bennet
//  Created 11/04/2022
//------------------------------------------------------

//Libraries
import React, { useContext } from 'react';
import { Routes, Route } from "react-router-dom";

//Contexts
import { GetUser } from './Library/UserContexts';

//Pages
import Events from './Pages/Events/Events';
import NewEvent from './Pages/NewEvent/NewEvent';
import MyEvents from './Pages/MyEvents/MyEvents';
import Registrations from './Pages/Registrations/Registrations';
import NotFound from './Pages/NotFound/notfound';
import EventEdit from './Pages/NewEvent/EventEdit';
import EventDetail from './Components/EventDetail/EventDetail';

//Components
import Navbar from './Components/Navbar/Navbar';

//Styles
import './App.css'
// eslint-disable-next-line
import "bootstrap/dist/css/bootstrap.min.css";


export default function App() {

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
    const getUser = useContext(GetUser);

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------

    function IsAdmin(){
      if (getUser === undefined) return;

      if (getUser?.roles.isAdmin){
        return(
          
          // <> returns HTML
          <>
          <Route path="/newevent" element={ <NewEvent/> }/>

          <Route path="/registrations" element={ <Registrations/> }/>

          <Route path="/eventedit/:eventid" element={ <EventEdit/> }/>
          </>
          
        )
      }
    }

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    return (
      <div className="App-Container">

        {/* Nav */}
        <div className='App-Container-Nav'>
          <Navbar></Navbar>
        </div>

        {/* Body > Contains all pages in the app  */}
        <div className='App-Container-Body'>

          <Routes>           
            <Route path="/" element={<Events/>}/>
            <Route path="/events" element={ <Events/> }/>
            <Route path="/myevents" element={ <MyEvents/> }/>
            <Route path="/eventdetail/:eventid" element={ <EventDetail/> }/>

            {/* Routes for admins to appear */}
            {IsAdmin()}

            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>

      </div>
    )

    //------------------------------------------------------
}