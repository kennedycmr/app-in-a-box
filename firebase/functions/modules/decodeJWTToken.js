// ---------------------------------------------
//  verifyMSAdaptiveToken - Decoding the MS token, NOT verifying it!
//    Always returns a 'promise'
//    https://docs.microsoft.com/en-us/outlook/actionable-messages/security-requirements#verifying-that-requests-come-from-microsoft
//    https://github.com/auth0/node-jsonwebtoken
//    https://www.youtube.com/watch?v=vgocTvahk18
//
//    Example:
//    decodeJWTToken(idToken).then((results) =>{
//
//     console.log('results', results);
//
//    })
//
//
// ---------------------------------------------

const jwt = require('jsonwebtoken');

module.exports = async function DecodeJWTToken(idToken) {

  try {

    return jwt.decode(idToken);

  } catch (error) {

    throw new Error('Function decodeJWTToken failed to complete, error', error);

  }

};
