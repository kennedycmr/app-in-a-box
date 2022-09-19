### Variables to simulate a Bitbucket Pipeline Environment. If this is running
#   via Bitbucket, you can ignore as they will be auto-populated by Bitbucket.
export BITBUCKET_CLONE_DIR=/workdir
export BITBUCKET_REPO_SLUG=app-in-a-box



### Get local environment variables
## Check if we already have an environment variables file
if [ -f .env_vars ]; then
    printf "\n\nI found an existing environment variables file. Below is what is in that file:\n"
    cat .env_vars

    unset GCP_PROJECT_ID
    unset GCP_DEFAULT_REGION
    unset TERRAFORM_STATE_BUCKET_NAME
    unset GCP_DEPLOYMENT_KEYFILE
    unset TERRAFORM_ACTION
    unset FB_APP_ID
    unset FB_API_KEY
    unset FB_MESSAGING_SENDER_ID
    unset AZURE_TENANT_ID

    GCP_PROJECT_ID=$(cat .env_vars |grep -e ^GCP_PROJECT_ID |sed 's/GCP_PROJECT_ID=//g')
    GCP_DEFAULT_REGION=$(cat .env_vars |grep -e ^GCP_DEFAULT_REGION |sed 's/GCP_DEFAULT_REGION=//g')
    TERRAFORM_STATE_BUCKET_NAME=$(cat .env_vars |grep -e ^TERRAFORM_STATE_BUCKET_NAME |sed 's/TERRAFORM_STATE_BUCKET_NAME=//g')
    GCP_DEPLOYMENT_KEYFILE=$(cat .env_vars |grep -e ^GCP_DEPLOYMENT_KEYFILE |sed 's/GCP_DEPLOYMENT_KEYFILE=//g')
    TERRAFORM_ACTION=$(cat .env_vars |grep -e ^TERRAFORM_ACTION |sed 's/TERRAFORM_ACTION=//g')
    FB_APP_ID=$(cat .env_vars |grep -e ^FB_APP_ID |sed 's/FB_APP_ID=//g')
    FB_API_KEY=$(cat .env_vars |grep -e ^FB_API_KEY |sed 's/FB_API_KEY=//g')
    FB_MESSAGING_SENDER_ID=$(cat .env_vars |grep -e ^FB_MESSAGING_SENDER_ID |sed 's/FB_MESSAGING_SENDER_ID=//g')
    AZURE_TENANT_ID=$(cat .env_vars |grep -e ^AZURE_TENANT_ID |sed 's/AZURE_TENANT_ID=//g')

else   
    printf "\nNo local '.env_vars' file found. Can't continue."
    return 1
fi



### Setup deployment key file.
export GCP_DEPLOYMENT_KEYFILE=$(cat ${GCP_DEPLOYMENT_KEYFILE} |base64)




### Run Bitbucket pipelines
source ${BITBUCKET_CLONE_DIR}/pipelineScripts/deploy_app-in-a-box.sh
