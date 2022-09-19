// ---------------------------------------------
//  callAPI - Generic way to call any API
//    Always returns a 'promise'
//    https://www.npmjs.com/package/node-fetch
// ---------------------------------------------

// Libraries
const fetch = require('node-fetch');

module.exports = async function callAPI(endPoint, options) {

  // Call the API & handle response
  try {

    let fetchResponse = await fetch(endPoint, options);
    fetchResponse = await fetchResponse.json();
    return fetchResponse;

  } catch (error) {

    throw new Error('Function callAPI failed to complete, error', error);

  }

};
