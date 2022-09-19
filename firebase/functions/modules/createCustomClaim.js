// ---------------------------------------------
//  createCustomClaim - Set and validate custom user claims via the Admin SDK
//    This operation always overwrites the user's existing custom claims
//    https://firebase.google.com/docs/auth/admin/custom-claims#node.js
// ---------------------------------------------

// Libraries
const admin = require('firebase-admin');

module.exports = async function createCustomClaim(emailAddress, claimObject) {

  try {

    // Find user by email
    admin.auth().getUserByEmail(emailAddress) .then((userRecord) => {

      // See the UserRecord reference doc for the contents of userRecord.
      const userObject = userRecord.toJSON();

      // Set claim
      admin.auth().setCustomUserClaims(
        userObject.uid,
        claimObject,
      ).then(() => {

        // The new custom claims will propagate to the user's ID token the
        // next time a new one is issued.
        return 'success';

      });

    }).catch((error) =>{

      throw new Error('Function createCustomClaim failed to complete, error', error);

    });

  } catch (error) {

    throw new Error('Function createCustomClaim failed to complete, error', error);

  }

};
