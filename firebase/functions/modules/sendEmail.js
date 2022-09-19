// ---------------------------------------------
//  sendEmail - Generic way to send an email via MS Graph
//    Always returns a 'promise'
//    https://docs.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0&tabs=http
//
//  Example:
//   sendEmail(sender, recipients, subject, htmlContent, accessToken).then((results) =>{
//     console.log('access token', results)
//   })
// ---------------------------------------------

// Libraries
const fetch = require('node-fetch');

module.exports = async function sendEmail(sender, recipients, subject, htmlContent, accessToken) {

  // Prepare API call
  const prepareRequest = new Promise(function(resolve, reject) {

    try {

      // toRecipients: build the array of objects
      const toRecipients = [];
      recipients.forEach((emailaddress) => {

        toRecipients.push({
          'emailAddress': {
            'address': emailaddress,
          },
        });

      });

      // Build headers and body
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };
      const body = {
        'message': {
          'subject': subject,
          'body': {
            'contentType': 'HTML',
            'content': htmlContent,
          },
          'toRecipients': toRecipients,
        },
        'saveToSentItems': 'false',
      };
      const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      };
      resolve(options);

    } catch (error) {

      reject(new TypeError('Failed to prepare request, error', error));

    }

  });

  // Call API
  return prepareRequest.then((options) =>{

    // Send email
    return fetch(`https://graph.microsoft.com/v1.0/users/${sender}/sendMail`, options).then((response) =>{

      // Check status codes
      if (response.status == 202) {

        return 'success';

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

    throw new Error(`Function sendEmail failed to complete, error ${error}`);

  });

};
