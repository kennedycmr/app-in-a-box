#!/bin/bash 

#===========================================================
#   Configure the Bit-Bucket pipeline with any requirements
#   API's
#   Service Accounts
#   Environment Variables
#===========================================================

# Environment variables that we need: 
export NODE_VERS=v14.18.0  #version of node to install




# There are variable we need, and should be set as pipeline variables.
# Make sure we have the correct pipeline variables available
export  PIPELINE_VARIABLES="AZURE_TENANT_ID
                            BITBUCKET_CLONE_DIR
                            BITBUCKET_REPO_SLUG
                            FB_APP_ID
                            FB_API_KEY
                            FB_MESSAGING_SENDER_ID
                            GCP_DEFAULT_REGION
                            GCP_DEPLOYMENT_KEYFILE
                            GCP_PROJECT_ID
                            TERRAFORM_STATE_BUCKET_NAME 
                            TERRAFORM_ACTION"
for VARIABLE in $PIPELINE_VARIABLES; do
    if [ $(set |grep ^"$VARIABLE=" |wc -l) -ne 1 ]; then
        echo "ERROR: Have you set the pipeline variable $VARIABLE?"
        exit 1
    else
        echo "INFO: Found variable $VARIABLE"
    fi
done




# Below are environment variables computed based on you have supplied already.
# You shouldn't need to change, unless you know what you are doing.
export FB_PROJECTID=${GCP_PROJECT_ID}
export FB_AUTH_DOMAIN=${FB_PROJECTID}.firebaseapp.com
export FB_STORAGE_BUCKET=${FB_PROJECTID}.appspot.com
export FB_DATABASE_URL=https://${FB_PROJECTID}-default-rtdb.firebaseio.com





# Install OS Dependencies.
apt-get update --allow-releaseinfo-change
apt-get install -y unzip sed wget curl zip


# Install Node
cd /opt
wget https://nodejs.org/dist/${NODE_VERS}/node-${NODE_VERS}-linux-x64.tar.xz
tar -xf node-${NODE_VERS}-linux-x64.tar.xz
cd node-${NODE_VERS}-linux-x64
cp -p bin/node /usr/local/bin/
node -v


### Install npm (latest)
cd /opt
curl -L https://www.npmjs.com/install.sh | sh
update-alternatives --install /usr/bin/npm npm /usr/local/lib/node_modules/npm/bin/npm-cli.js 1
update-alternatives --display npm
npm -v


#Install firebase tools
npm install -g firebase-tools



# -------------------------------------------------
#  Authenticating to Google
# -------------------------------------------------

# The docker image we use has the gcloud SDK already installed but we need to configure
# authentication
# Create local temp. keyfile from BB repo. variable we created
echo "INFO: Extracting the deployment key from Bit-Bucket..."
export GCP_KEY_FILE=/root/gcp-deployment-key.json
echo ${GCP_DEPLOYMENT_KEYFILE} | base64 --decode --ignore-garbage > ${GCP_KEY_FILE}

# Configure gcloud to use the deployment key
echo "INFO: Configuring gcloud to the deployment key..."
gcloud auth activate-service-account --key-file ${GCP_KEY_FILE}

# Configure gcloud to use our project we defined in the bb repo variables
echo "INFO: Configuring gcloud to use the GCP Project..."
gcloud config set project ${GCP_PROJECT_ID} --quiet

# Configure gcloud cli
echo "INFO: Displaying active gcloud config list..."
gcloud config list


# -------------------------------------------------
#  Enable APIs
# -------------------------------------------------

# APIs
echo "INFO: Enabling APIs..."
export SERVICES_TO_ENABLE=" artifactregistry
                            appengine
                            cloudbuild
                            cloudfunctions
                            cloudresourcemanager
                            firebase
                            serviceusage"

for SERVICE in $SERVICES_TO_ENABLE; do 
    echo "INFO: Enabling service $SERVICE..."
    gcloud services enable ${SERVICE}.googleapis.com
    echo $?
done




### This runs prior to build to configure the correct .env file for the current deployment

printf "\n\n########    Updating .env files for frontend   ##########\n\n"

# Environment Template file
envSrcFile=${BITBUCKET_CLONE_DIR}/env-templates/env-template

# The env file that will be updated
envDestFile=${BITBUCKET_CLONE_DIR}/appengine/.env

# Copy the template file to the correct place
echo -n "copying $envSrcFile to $envDestFile..."
cp -f $envSrcFile $envDestFile
echo $?

# Update the environment file with the correct variables
echo "Updating key/values in file {envDestFile}:"
export VALUES_TO_UPDATE="FB_API_KEY
                         FB_AUTH_DOMAIN
                         FB_PROJECTID
                         FB_STORAGE_BUCKET
                         FB_MESSAGING_SENDER_ID
                         FB_APP_ID
                         FB_DATABASE_URL
                         AZURE_TENANT_ID"

for KEY in $VALUES_TO_UPDATE; do
    VALUE=${!KEY}
   
    sed -i "s|__${KEY}__|$VALUE|g" $envDestFile
    echo "  -> $KEY...$?"
done

echo ""






#===========================================================
#   Build the React application
#   Note: We are using a different BB image that DOESNT contain the Google SDK
#===========================================================

# Ignoring warning/error messages
# https://dev.to/kapi1/solved-treating-warnings-as-errors-because-of-process-env-ci-true-bk5
echo "INFO: Ignoring warning/error messages"
export CI=false

#Prepare React
echo "INFO: Preparing React Build"

#Switch directory to 'appengine'
cd ${BITBUCKET_CLONE_DIR}/appengine
npm install

echo "INFO: Building React..."
CI=false npm run build

#Prepare Firebase Functions
echo "INFO: Preparing Firebase Functions"

cd ${BITBUCKET_CLONE_DIR}/firebase/functions
npm install







# This is the version of Terraform we will use
export TERRAFORM_VERSION=1.0.9

# Set up GCP project ID
export TF_VAR_GCP_PROJECT_ID=${GCP_PROJECT_ID}

# Setup GCP credentials for Terraform usage
export GOOGLE_APPLICATION_CREDENTIALS=${GCP_KEY_FILE}

echo "INFO: Terraform will use bucket: gs://${TERRAFORM_STATE_BUCKET_NAME}/terraform/state/${BITBUCKET_REPO_SLUG}"
echo "      for it's state file."

# Remove any cached local TF files if there exist
rm -rf ${BITBUCKET_CLONE_DIR}/terraform/.terraform
rm -rf ${BITBUCKET_CLONE_DIR}/terraform/.terraform.locl.hcl

# Setup Terraform.
echo "INFO: Setting up Terraform environment..."
cd ~
rm -rf terrafor*
wget -q https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip
unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip
export PATH=$PATH:$(pwd)

# Provision Terraform resources.
cd ${BITBUCKET_CLONE_DIR}/terraform

# Download plugins needed for Terraform 
terraform init \
         -backend-config="bucket=${TERRAFORM_STATE_BUCKET_NAME}" \
         -backend-config="prefix=terraform/state/${BITBUCKET_REPO_SLUG}"

# Ensure Terraform syntax is valid before proceeding.
printf '#################     Terraform Validate Stage  ######################################\n\n\n'
terraform validate

# Run Terraform plan to determine what will be changed 
printf '#################     Terraform Plan Stage      ######################################\n\n\n'
terraform plan

# Apply Terraform configuration changes
printf '#################     Terraform Action Stage    ######################################\n\n\n'
echo "INFO: running a ${TERRAFORM_ACTION} action."

if [ "${TERRAFORM_ACTION}" == "plan" ]; then
  echo "Terraform_action set to ${TERRAFORM_ACTION}. Not running apply phase."

elif [ "${TERRAFORM_ACTION}" == "apply" ]; then
  echo "INFO: Running terraform apply"
  terraform ${TERRAFORM_ACTION} -auto-approve

elif [ "${TERRAFORM_ACTION}" == "destroy" ]; then
  echo "INFO: Running terraform destroy"
  terraform ${TERRAFORM_ACTION} -auto-approve

else
  echo "I dont know what to do when TERRAFORM_ACTION = \'${TERRAFORM_ACTION}\'. Check the BB repository variables."
fi







#===========================================================
#   Deploy App Engine Application
#===========================================================

#Switch directory to 'appengine'
cd ${BITBUCKET_CLONE_DIR}/appengine

#Run gcloud command to deploy app engine instance
echo "INFO: Deploying App Engine Application Instance"
gcloud app deploy app.yaml --project=${GCP_PROJECT_ID} --quiet










#===========================================================
#   Deploy Firebase
#   - Firebase Functions 
#   - Firestore Security Rules
#===========================================================

# Set the region to avoid org policy constraint
export FIREBASE_FUNCTIONS_UPLOAD_REGION=$GCP_DEFAULT_REGION


# Update Firebase Environment Configuration
FB_SRC_ENV_TEMPLATE=${BITBUCKET_CLONE_DIR}/env-templates/firebaserc-template
FB_DST_ENV_LOCATION=${BITBUCKET_CLONE_DIR}/firebase/.firebaserc

cp -f $FB_SRC_ENV_TEMPLATE $FB_DST_ENV_LOCATION
/bin/sed -i "s|__GCP_PROJECT_ID__|${GCP_PROJECT_ID}|g" $FB_DST_ENV_LOCATION



# Install node and firebase tools
npm install -g firebase-tools





# Deploy Firebase Functions and Security Rules.
echo "INFO: Deploying Firebase Functions & Security Rules "
cd ${BITBUCKET_CLONE_DIR}/firebase
firebase deploy --force




# Display the remote URL for the new site
WEB_SITE_URL=$(gcloud app describe |grep -e ^defaultHostname |sed 's|defaultHostname: |https://|g')
printf "\nNew Web URL: ${WEB_SITE_URL}\n\n"



# Display back to user what's next.
printf "\n\n\n"
printf "If this is the first time you are running this, you will need to get some updated variable values,\n"
printf "and then update the local .env_vars file with the correct values.\n"
printf "\nThen re-run the deployment script as you just did, and this time it will apply all the correct values.\n\n"
