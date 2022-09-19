// ---------------------------------------------
//  This file contains all Firebase Functions
//  Help Documentation:
//    https://firebase.google.com/docs/functions/firestore-events#event_triggers
// ---------------------------------------------


// ---------------------------------------------
//  Initialize Environment
// ---------------------------------------------

// Libraries
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Modules
//  Check the modules folder for a complete list, we have built alot of functions
//  for people to use
const writeLog = require('./modules/writeLog');
const getDocument = require('./modules/getDocument');
const writeDocument = require('./modules/writeDocument');
const queryDocument = require('./modules/queryDocument');
const callService = require('./modules/callService');

// ---------------------------------------------
//  Function Name: Client Error Handler
//  Route: N/A
//  Method: onCreate
//  Description: Captures client errors from Firestore and writes them to Cloud Logging
// ---------------------------------------------

exports.clienterrorhandler = functions.region('us-east4').firestore.document('failures/{documentId}').onCreate((snapShot, context) => {

  // ---------------------------------------------
  //  Extract the document properties
  // ---------------------------------------------

  let company;
  let emailaddress;
  let message;
  try {

    // Get snapshot
    const documentObject = snapShot.data();

    // Document properties
    company = documentObject.company;
    emailaddress = documentObject.emailaddress;
    message = documentObject.message;

  } catch (error) {

    throw new Error(`Failed to extract company, emailaddress or message, error ${error}`);

  }

  // ---------------------------------------------
  //  Write errors to Cloud Logging
  // ---------------------------------------------

  return writeLog('ERROR', '------------ Client side error detected -----------').then((results) => {

    writeLog('ERROR', `Company ${company}`);
    writeLog('ERROR', `User ${emailaddress}`);
    writeLog('ERROR', `message ${message}`);
    writeLog('ERROR', '---------------------------------------------------');
    return 'success';

  }).catch((error) => {

    return `Failed to log message, error ${error}`;

  });

});

// ---------------------------------------------
//  Function Name: Available Seats Handler
//  Route: N/A
//  Method: onCreate
//  Description: Checks available seats and adjusts accordingly
// ---------------------------------------------

exports.availableseatshandler = functions.region('us-east4').firestore.document('registrations/{documentId}').onCreate((snapShot, context) => {

  // ---------------------------------------------
  //  Extract the document properties
  // ---------------------------------------------

  let eventid;

  try {

    // Get snapshot
    const documentObject = snapShot.data();

    // Document properties
    eventid = documentObject.eventid;

  } catch (error) {

    writeLog('ERROR', `Failed to extract eventid - Error ${error}`);
    throw new Error(`Failed to extract eventid - Error ${error}`);

  }

  // ---------------------------------------------
  //  1. Go to Collection and get events document
  //  2. Available seat minus 1
  //  3. Write to Events document
  // ---------------------------------------------

  return getDocument('events', eventid).then((document)=>{

    const newAvailableSeat = {
      'availableseats': parseInt(document.availableseats) - 1,
    };

    return writeDocument('events', eventid, newAvailableSeat, true);

  }).catch((error)=>{

    writeLog('ERROR', `Failed to update available - Error ${error}`);
    throw new Error(`Failed to update available - Error ${error}`);

  });

});

// ---------------------------------------------
//  Function Name: Cancelled Handler
//  Route: N/A
//  Method: onUpdate
//  Description: Updates available seats and emails waitlisted user
// ---------------------------------------------

exports.cancelledhandler = functions.region('us-east4').firestore.document('registrations/{documentId}').onUpdate((change, context) => {

  // ---------------------------------------------
  //  Extract the document properties
  // ---------------------------------------------

  let eventid;

  try {

    // Get snapshot
    const documentObject = change.after.data();

    // Document properties
    eventid = documentObject.eventid;

  } catch (error) {

    writeLog('ERROR', `Failed to extract eventid and status - Error ${error}`);
    throw new Error(`Failed to extract eventid and status - Error ${error}`);

  }

  // ---------------------------------------------
  //  1. Go to Collection and updates registration document
  //  2. Check Registrations for waitlisted user
  //  3. If waitlisted user exists, email user and update status to registered in the Registration Collection
  //  4. f no waitlisted user, update availableseats + 1 in Events in Collection
  // ---------------------------------------------

  const eventsPromise = getDocument('events', eventid);

  const queries = [
    ['status', '==', 'waitlisted'],
    ['eventid', '==', eventid],
  ];

  const registrationPromise = queryDocument('registrations', queries);

  return Promise.all([eventsPromise, registrationPromise]).then((documents)=>{

    const events = documents[0];
    const registrations = documents[1];

    if (registrations.length > 0) {

      const registration = registrations[0];
      const payload = {
        'emailAddress': registration.useremail,
        'emailSubject': `You have registered for an Event - ${events.name}`,
        'emailTemplate': 'eventsApp_waitlisted.html',
        'emailParameters': {
          '$given_name': registration.useremail.split('.')[0][0].toUpperCase() + registration.useremail.split('.')[0].slice(1),
          '$eventname': events.name,
          '$ics_link': events.icsurl,
        },
      };

      return callService('https://us-east4-ccprod73345.cloudfunctions.net/cc-emailbot', payload).then(()=>{

        const document = {
          'status': 'registered',
        };

        return writeDocument('registrations', registration.registrationid, document, true);

      });

    } else {

      const seats = {
        'availableseats': parseInt(events.availableseats) + 1,
      };

      return writeDocument('events', events.eventid, seats, true);

    }

  }).catch((error)=>{

    writeLog('ERROR', `Something has gone wrong - Error ${error}`);
    throw new Error(`Something has gone wrong - Error ${error}`);

  });

});
