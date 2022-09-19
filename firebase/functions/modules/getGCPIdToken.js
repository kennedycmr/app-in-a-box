// ---------------------------------------------
//  GetGCPIdToken - Get a Google Id Token
//    IMPORTANT: This function only works in GCP and we can't use the node SDK as it doesnt support trigger functions :(
//    Always returns a 'promise'
//    https://cloud.google.com/functions/docs/securing/authenticating
//
//  Example:
//    GetGCPIdToken('api://AzureADTokenExchange').then((googleIdToken) =>{
//      console.log('googleIdToken', googleIdToken)
//    })
// ---------------------------------------------

// Libraries
const fetch = require('node-fetch');

module.exports = async function GetGCPIdToken(audience) {

  try {

    const endpoint = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${audience}`;
    const options = {
      method: 'GET',
      headers: {
        'Metadata-Flavor': 'Google',
      },
    };

    let response = await fetch(endpoint, options);

    if (response.status === 200) {

      // The response is NOT JSON!
      // This must be converted with the .text() function
      response = await response.text();
      return response;

    } else {

      try {

        const error = response.json();
        throw new Error(`Failed, unknown status code: ${response.status} error: ${error}`);

      } catch (error) {

        throw new Error(`Unable to extract error from api call, ${error}`);

      }

    }

  } catch (error) {

    throw new Error(`Error creating google id token: ${error}`);

  }

};

/*
// ---------------------------------------------
//  GetGCPIdToken - Get a Google Id Token (local code for testing - swap for code above)
//    Always returns a 'promise'
//
//  Example:
//    GetGCPIdToken('api://AzureADTokenExchange').then((googleIdToken) =>{
//      console.log('googleIdToken', googleIdToken)
//    })
// ---------------------------------------------

// Libraries
const {JWT, GoogleAuth} = require('google-auth-library');
const auth = new GoogleAuth();

module.exports = async function getGCPIdToken(audience) {

  try {

    console.log(JSON.stringify(auth));
    const cred = await auth.getApplicationDefault();
    console.log(JSON.stringify(cred.credential));
    const jwt = new JWT({email: cred.credential.email, key: cred.credential.key});
    console.log(JSON.stringify(jwt));
    const token = await jwt.fetchIdToken(audience);
    return token;

  } catch (error) {

    throw new Error(`Error creating Google ID Token: ${error}`);

  }

};
*/
