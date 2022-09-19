//------------------------------------------------------
//  Initialize React
//------------------------------------------------------

  import React from 'react';
  import ReactDOM from 'react-dom/client';

//------------------------------------------------------
//  Initialize redux, useContexts & styling
//------------------------------------------------------

  import UserContexts from './Library/UserContexts'
  import './index.css';

//------------------------------------------------------
//  Initialize Firebase & Auth
//  We are using MS App Reg, see the readme for more information
//------------------------------------------------------

  import { initializeApp } from 'firebase/app';
  import {firebaseConfig} from './Library/FirebaseConfig';
  import AuthProvider from "./Library/AuthProvider";
  import LoginHandler from './Library/LoginHandler';

  //Initialize Firebase App
  initializeApp({...firebaseConfig});

//------------------------------------------------------
//  Return the App
//------------------------------------------------------

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <UserContexts>
      <AuthProvider>
        <LoginHandler></LoginHandler>
      </AuthProvider>
    </UserContexts>,
  );

//------------------------------------------------------