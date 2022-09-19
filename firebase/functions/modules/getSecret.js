// ---------------------------------------------
//  getSecret - Calls with Googles secret manager in a project to extract secrets
//    Always returns a 'promise'
//    https://cloud.google.com/secret-manager/docs/quickstart#secretmanager-quickstart-nodejs
//
//  Example:
//   getSecret('project123', 'Super_Secret_API_Key').then((results) =>{
//     console.log('access token', results)
//   })
// ---------------------------------------------


module.exports = async function getSecret(projectId, secretName) {

  try {

    // Library
    const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

    // Create the 'Secret Manager Service Client'
    const client = new SecretManagerServiceClient();

    // Get the secret
    const [accessResponse] = await client.accessSecretVersion({name: `projects/${projectId}/secrets/${secretName}/versions/latest`});
    return accessResponse.payload.data.toString('utf8');

  } catch (error) {

    throw new Error('Function getSecret failed to complete, error', error);

  }

};
