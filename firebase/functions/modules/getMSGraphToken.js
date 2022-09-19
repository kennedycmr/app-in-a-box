// ---------------------------------------------
//  getMSGraphToken - Generic way to get a MS Graph token
//  This function is using 'getGCPIdToken' from modules folder!
//    Always returns a 'promise'
//    https://docs.microsoft.com/en-us/azure/active-directory/develop/workload-identity-federation-create-trust-gcp?tabs=typescript#configure-an-azure-ad-app-to-trust-a-google-cloud-identity
//
//  Example:
//   const audience = 'api://AzureADTokenExchange';
//   const tenantId = 'bc0c325b-6efc-4ca8-9e46-11b50fe2aab5';
//   const applicationId = 'd629252e-d350-4399-895c-3b1a59482248'
//   getMSGraphToken(tenantId, applicationId).then((results) =>{
//     console.log('access token', results)
//   })
//
// ---------------------------------------------

// Libraries
const fetch = require('node-fetch');

// Modules
const getGCPIdToken = require('./getGCPIdToken');

module.exports = async function getMSGraphToken(tenantId, applicationId) {

  // Audience is fixed for all calls to Azure AD
  const audience = 'api://AzureADTokenExchange';

  // ---------------------------------------------
  //  Pre-req 1 > Get Google id token
  //  https://github.com/googleapis/google-auth-library-nodejs/blob/main/samples/idtokens-serverless.js
  // ---------------------------------------------

  const prepareGoogleReq = getGCPIdToken(audience);

  // ---------------------------------------------
  //  Pre-req 2 > Create API payload
  //  https://docs.microsoft.com/en-us/graph/auth-v2-service
  // ---------------------------------------------

  const prepareApiReq = prepareGoogleReq.then((googleIdToken) =>{

    try {

      const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
      const body = new URLSearchParams({
        'client_id': applicationId,
        'client_assertion': googleIdToken,
        'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        'scope': 'https://graph.microsoft.com/.default',
        'grant_type': 'client_credentials',
      });

      return {
        method: 'POST',
        headers: headers,
        body: body,
      };

    } catch (error) {

      throw new Error(`Failed to prepare request, error ${error}`);

    }

  });

  // ---------------------------------------------
  //  Get MS Graph Token
  // ---------------------------------------------

  return prepareApiReq.then((options) =>{

    // Get MS Graph token
    return fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, options).then((response) =>{

      // Convert to json
      return response.json().then((results) =>{

        if (response.status == 200) {

          return results.access_token;

        } else {

          try {

            const error = response.json();
            throw new Error(`Failed, unknown status code: ${response.status} error: ${error}`);

          } catch (error) {

            throw new Error(`Unable to extract error from api call, ${error}`);

          }

        }

      });

    }).catch((error) => {

      throw new Error(`Function getMSGraphToken failed to complete, error ${error}`);

    });

  });

};
