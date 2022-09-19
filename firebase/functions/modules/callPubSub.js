// ---------------------------------------------
//  CallPubSub - Generic way to call a pubsub function
//    Always returns a 'promise'
//    https://cloud.google.com/functions/docs/calling/pubsub#publishing_a_message_from_within_a_function
// ---------------------------------------------

// Libraries
const {PubSub} = require('@google-cloud/pubsub');

module.exports = async function CallPubSub(pubsubTopic, requestBody) {

  // Instantiates a client
  const pubsub = new PubSub();

  // References an existing topic
  const topic = pubsub.topic(pubsubTopic);

  const messageBuffer = Buffer.from(JSON.stringify(requestBody), 'utf8');

  // Publishes a message
  try {

    await topic.publish(messageBuffer);
    return 'success';

  } catch (error) {

    throw new Error('Failed submit pubsub', error);

  }

};
