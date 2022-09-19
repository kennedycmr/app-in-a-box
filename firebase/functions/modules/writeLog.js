// ---------------------------------------------
//  WriteLog - Generic way to write logs from Firebase functions to Google Cloud Logging
//    https://cloud.google.com/logging/docs/reference/libraries#client-libraries-install-nodejs
//
//  How to use:
//    text
//      What information you want to log
//
//    severity (https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity)
//      INFO
//      WARNING
//      ERROR
//      CRITICAL
//
//  Example:
//    WriteLog('INFO', 'INFO test')
//    WriteLog('WARNING', 'WARNING test')
//    WriteLog('ERROR', 'ERROR test')
// ---------------------------------------------

// Libraries
const {Logging} = require('@google-cloud/logging');

module.exports = function WriteLog(severity, text) {

  try {

    // Get project
    const projectId = process.env.GCP_PROJECT;

    // Create logging client
    const logging = new Logging({projectId});

    // Selects the log to write to
    const logName = `functions`;
    const log = logging.log(logName);

    // The metadata associated with the entry
    const metadata = {
      resource: {
        type: 'cloud_function',
        region: 'us-central1',
      },
      severity: severity,
    };

    // pre-processing for log message
    // Prevents overflow of long log messages
    const logMessage = `${String(text).slice(0, 512)}`;

    // Prepares a log entry
    const entry = log.entry(metadata, logMessage);

    // Write log
    log.write(entry);
    console.log(`${severity}: ${logMessage}`);

    return 'success';

  } catch (error) {

    throw new Error(`Function WriteLog failed to complete, error ${error}`);

  }

};
