// ---------------------------------------------
//  GetFirebaseToken - Creates a Firebase token
//    Always returns a 'promise'
//    https://firebase.google.com/docs/auth/admin/create-custom-tokens
//
//  Example:
//
// const additionalClaims = {
//   email: approverEmail,
//   request: request,
// };
// return getFirebaseToken(`${approverEmail}-approver`, additionalClaims).then((response) =>{
//
//   console.log('response', response);
//
// });

// ---------------------------------------------

// Libaries
const {getAuth} = require('firebase-admin/auth');

module.exports = async function GetFirebaseToken(uid, additionalClaims) {

  return getAuth().createCustomToken(uid, additionalClaims).then((customToken) => {

    return customToken;

  }).catch((error) => {

    throw new Error(`Error creating custom token: ${error}`);

  });

};
