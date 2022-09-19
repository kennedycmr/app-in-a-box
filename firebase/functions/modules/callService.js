// ---------------------------------------------
//  CallService - Generic way to call a http service like Cloud Functions or Cloud Run
//    Always returns a 'promise'
//
//  Example:
//  CallService(endpoint, payload).then((results) =>{
//
//    console.log('results', results);
//
//  });
// ---------------------------------------------

// Libraries
const fetch = require('node-fetch');


module.exports = async function CallService(endpoint, payload) {

  // ---------------------------------------------
  //  Get ID Token for the Cloud Function
  //  https://stackoverflow.com/questions/42784000/calling-a-cloud-function-from-another-cloud-function
  //
  //  There is an issue with 'google-auth-library', so dont waste your time! :(
  //    https://github.com/googleapis/google-auth-library-nodejs/issues/1208
  //    https://github.com/googleapis/google-auth-library-nodejs/pull/1218/files
  // ---------------------------------------------

  // Fetch the token
  const metadataServerURL = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=';
  const tokenUrl = metadataServerURL + endpoint;
  const header = {
    'method': 'GET',
    'headers': {'Metadata-Flavor': 'Google'},
  };

  return fetch(tokenUrl, header).then((response) =>{

    return response.text().then((token) =>{

      // Prepare payload
      const options = {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`,
        },
        body: JSON.stringify(payload),
      };

      // ---------------------------------------------
      //  Calling the Cloud Function with the GCP id token
      // ---------------------------------------------

      return fetch(endpoint, options).then((fetchResponse) =>{

        return fetchResponse.json().then((results) =>{

          return results;

        });

      });

    });

  }).catch((error) =>{

    throw new Error(`Function CallService failed to complete, error ${error}`);

  });

};
