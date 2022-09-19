# Cloud Studio App in a box
App in a box (web-app), is a template created to help developers quickly deploy an opinionated starter
 web-app. It uses ReactJS deployed on APP Engine for the frontend, Firebase as a NoSQL database
 and Azure AD as the authentication provider which means users will need an account in an Azure
 AD tenant in order to login to the deployed application.

Use this as a template to get started, and then modify to suit your requirements.


# Quick Guide - Deployment Steps using GCP Console

The below steps describe the steps you need to take assuming you are trying to manually
 deploy this web-app. These instructions assume will be performing all the steps from a GCP
 console. You are also using a new GCP Project and your user account has owner rights to that project.


## Run stage 1
Run the following command: 

```
git clone https://github.com/kennedycmr/app-in-a-box && \
docker run --rm -v $(pwd)/app-in-a-box:/workdir -ti gcr.io/google.com/cloudsdktool/cloud-sdk:latest bash /workdir/test/start_on_gcp_console.sh
```


## Obtain the remaining 4 variables
You will be asked to get values for 4 variables from your newly deployed project resources and your Azure tenant. 
Obtain those variables and update the file so the 4 variables have correct data: 

```
${app-in-the-box-files}/test/.env_vars
```


### Re-run the pipeline using your existing variables.
Run the following command: 

```
docker run --rm -v $(pwd)/app-in-a-box:/workdir -ti gcr.io/google.com/cloudsdktool/cloud-sdk:latest bash /workdir/test/start_on_gcp_console.sh
```




# Below are the manual steps to setup a project

## Create and configure a new GCP Project

1. Create a new GCP Project: the project is is exported as: $GCP_PROJECT_ID.

1. Manually enable APIs: in your $GCP_PROJECT_ID, manually enable the following APIs:

* Service Usage API

## Create a Deployment Service Account

For this pipeline to work, it requires a Service Account (sa) that we call the "deploy" account.
 The deploy account is granted enough permissions so that it can deploy all the resources needed
 for this service to run.

* Create a service account that we will refer to as the deploy account.

* Grant the following iam/roles to the deploy account:
  - App Engine Admin
  - App Engine Creator
  - Firebase Admin
  - Firebase Service Management Service Agent
  - Storage Admin
  - Service Account User
  - Cloud Build Editor
  - Monitoring NotificationChannel Editor
  - Monitoring AlertPolicy Editor

* Create a keyfile for that service account, which will be encoded with base64 and saved as the
 GCP_DEPLOYMENT_KEYFILE environment variable.


## Create a Storage Bucket where the Terraform State Files will Reside

Terraform is the tool the pipeline uses to create and manage the deployment of resources. It uses
 "state files" as a simple database type concept to track what has been created and configured.
 Those state files are stored in a GCS bucket. You need to create a bucket, and grant the deply
 permissions to that bucket. Note: As the deploy account is granted Storage Admin role above, it
 should already be able to access the bucket, if the bucket is created in the same project.
 For production deployments, I recommend the storage class to be "standard" and versioning to be
 enabled in case of corruption.

* Create a storage bucket to be used by Terraform. This bucket name will be referred to as: TERRAFORM_STATE_BUCKET_NAME


## Deploy the Web-App  (Stage 1)

Copy this entire repository to it's own directory on your GCP console. For the purposes of these
 instructions, i'll assume you have copied to a directory "/workdir". Change "workdir" to where
 you copied the files.

Edit the file /workdir/test/run_pipeline.sh and at a minimum, ensure the following variables are
correctly set for your new environment:
  * GCP_PROJECT_ID
  * GCP_DEPLOYMENT_KEYFILE
  * TERRAFORM_STATE_BUCKET_NAME
  * TERRAFORM_ACTION  (should very likely be set to "apply")
  * GCP_DEFAULT_REGION

Run the script like: 

```
source /workdir/test/run_pipeline.sh
```


## Post Stage 1 Web-App Deployment

There is a lot of output as the web-app is deployed, but except for 1 line that talks about possible
 vulnerabilities (in React packages), there should be no lines that are red. If there are, investigate
 what the issue might be.

If successful, you should have 2 lines at the end like: 

```
Project Console: https://console.firebase.google.com/project/{GCP_PROJECT_ID}/overview

New Web URL: https://{GCP_PROJECT_ID}.uk.r.appspot.com
```


## Configuration Web-App Authentication

The following steps setup the web-app to allow users to authenticate using Azure AD credentials.
 You will need three pieces of information from the Azure AD Application Registration that you will
 be using. Make sure you have these before continuing: 

 * App Reg Client ID
 * App Reg Secret
 * Tenant ID

* Using a web browser, login to your "Project Console" (URL was output from the deployment script).

* Click Authentication -> Get Started -> Microsoft

* Enable by clicking the radial button called "Enable"

* Enter the Azure App Reg Client ID, and App Reg Secret where prompted.

* Copy the "Redirect URL". 

* Click save in the firebase portal console.

* In the Azure AD App Registration, enter the above "Redirect URL" in to the "authentication -> web -> redirect url" section.



* Using a web browser, login again to your project console.

* Navigate to Project Overview -> Project Settings.

* Click Authentication -> Settings -> Authorized Domains

* Add your "New Web URL" (from deployment script output) to this list, do not inclue the "HTTPS://". 


## Update/Complete your Deployment Script Variables

In your deployment script '/workdir/test/run_pipeline.sh' there were four variables that we could
 not fill in, so we just enter junk data. Now that our site is deployed and created, we can get
 the rest of those variables. 

* Using a web browser, login to your "Project Console".

* Navigate to Project Overview -> Project Settings.

* Under "Your Apps" section, click the "Config" radial button.

* Using the key/value pairs displayed, update your "run_pipeline.sh" script so that the remaining variables have valid data.

* Your Azure Tenant ID will come from your Azure AD App Registration.


## Re-Deploy the Web-App  (Stage 2)

Re-Run the script like: 

```
source /workdir/test/run_pipeline.sh
```

## Test your New Web-App

If all the above was successful, you should now be able to access your new web-app. 

* Using a web browser. access your web-app at the "New Web URL" displayed in your script output.

* Attempt to login to your web site using your Azure AD email+password.












#### Bitbucket Variables
* ```GCP_DEPLOYMENT_KEYFILE``` - Service account key in base64 format
* ```GCP_PROJECT_ID``` - Google project id
* ```TERRAFORM_STATE_BUCKET_NAME``` - Cloud storage bucket name
* ```TF_VAR_ALERT_ADMIN_EMAIL_ADDRESS``` - DL of the Team or Person that can handle Cloud Logging errors
* ```TERRAFORM_ACTION``` - ```plan```/```apply``` - What you would like terraform to do, in most cases you would deploy (also known as apply) the infrastuture


&nbsp;


