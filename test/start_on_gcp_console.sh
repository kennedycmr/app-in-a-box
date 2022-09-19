#!/bin/bash 


## Default env. vars
export BITBUCKET_CLONE_DIR="/workdir"
export BITBUCKET_REPO_SLUG="app-in-a-box"

cd ${BITBUCKET_CLONE_DIR}/test



## If prompted, allow auth
gcloud auth list


## Check that we are authenticated
gcloud projects list >/dev/null 2>&1
if [ $? -gt 0 ]; then
    printf "\n\nSeems like we are not authenticated as I couldn't do a simple projects list. Can't continue."
    return 1
fi


## Give prompt to user about this
printf "\n\n##################  NOTICE   ###############################\n\n"
printf "This script is designed to be run by new users trying to get a\n"
printf "feel for app-in-a-box.\n"
printf "1) You should run this script in the GCP UI Console in a new project.\n"
printf "2) Your account should have full rights to this project.\n"
printf "3) If you don't want to be prompted for variables, simply add those\n"
printf "   to the local file '.env_vars' and this script will detect them.\n\n"
printf "Continue? (Y/N): "
read CONFIRM


if [ "$CONFIRM" != "Y" ]; then
    printf "\nYou didn't answer 'Y' to confirmation. Can't continue.\n"
    return 0
fi


## Check if we already have an environment variables file
if [ -f .env_vars ]; then
    printf "\n\nI found an existing environment variables file. Below is what is in that file:\n"
    cat .env_vars

    printf "\n\nShould we continue with those variables, or delete it an start fresh? (Y/D): "
    read CONFIRM

    if [ $CONFIRM != "Y" ]; then
        rm -f .env_vars
        unset GCP_PROJECT_ID
        unset GCP_DEFAULT_REGION
        unset TERRAFORM_STATE_BUCKET_NAME
        unset GCP_DEPLOYMENT_KEYFILE
        unset TERRAFORM_ACTION
        unset FB_APP_ID
        unset FB_API_KEY
        unset FB_MESSAGING_SENDER_ID
        unset AZURE_TENANT_ID
    else
        GCP_PROJECT_ID=$(cat .env_vars |grep -e ^GCP_PROJECT_ID |sed 's/GCP_PROJECT_ID=//g')
        GCP_DEFAULT_REGION=$(cat .env_vars |grep -e ^GCP_DEFAULT_REGION |sed 's/GCP_DEFAULT_REGION=//g')
        TERRAFORM_STATE_BUCKET_NAME=$(cat .env_vars |grep -e ^TERRAFORM_STATE_BUCKET_NAME |sed 's/TERRAFORM_STATE_BUCKET_NAME=//g')
        GCP_DEPLOYMENT_KEYFILE=$(cat .env_vars |grep -e ^GCP_DEPLOYMENT_KEYFILE |sed 's/GCP_DEPLOYMENT_KEYFILE=//g')
        TERRAFORM_ACTION=$(cat .env_vars |grep -e ^TERRAFORM_ACTION |sed 's/TERRAFORM_ACTION=//g')
        FB_APP_ID=$(cat .env_vars |grep -e ^FB_APP_ID |sed 's/FB_APP_ID=//g')
        FB_API_KEY=$(cat .env_vars |grep -e ^FB_API_KEY |sed 's/FB_API_KEY=//g')
        FB_MESSAGING_SENDER_ID=$(cat .env_vars |grep -e ^FB_MESSAGING_SENDER_ID |sed 's/FB_MESSAGING_SENDER_ID=//g')
        AZURE_TENANT_ID=$(cat .env_vars |grep -e ^AZURE_TENANT_ID |sed 's/AZURE_TENANT_ID=//g')
    fi
else
        unset GCP_PROJECT_ID
        unset GCP_DEFAULT_REGION
        unset TERRAFORM_STATE_BUCKET_NAME
        unset GCP_DEPLOYMENT_KEYFILE
        unset TERRAFORM_ACTION
        unset FB_APP_ID
        unset FB_API_KEY
        unset FB_MESSAGING_SENDER_ID
        unset AZURE_TENANT_ID
fi 


## Get current GCP Project ID
if [ -z $GCP_PROJECT_ID ]; then
    GCP_PROJECT_ID=$(gcloud config list |grep -e ^project |sed 's/project = //g')

    CONFIRM="N"
    if [ ! -z $GCP_PROJECT_ID ]; then
        printf "\n\nWe will try and setup everything in the GCP Project: ${GCP_PROJECT_ID}.\nIs this correct? (Y/N): "
        read CONFIRM
    fi

    if [ $CONFIRM != "Y" ]; then
        printf "\nEnter the GCP PROJECT ID you want to set this up in: "
        read GCP_PROJECT_ID
    fi

    echo "GCP_PROJECT_ID=${GCP_PROJECT_ID}" >>.env_vars
fi
gcloud config set project $GCP_PROJECT_ID


## Set the deployment region
if [ -z $GCP_DEFAULT_REGION ]; then
    GCP_DEFAULT_REGION=us-east4

    printf "\n\nWe will try and setup everything in the GCP Region: ${GCP_DEFAULT_REGION}.\nIs this ok? (Y/N): "
    read CONFIRM

    if [ $CONFIRM != "Y" ]; then
        printf "\nEnter the GCP Region you want to deploy to: "
        read GCP_DEFAULT_REGION
    fi

    echo "GCP_DEFAULT_REGION=${GCP_DEFAULT_REGION}" >>.env_vars
fi


## Create the Terraform state bucket
if [ -z $TERRAFORM_STATE_BUCKET_NAME ]; then
    TERRAFORM_STATE_BUCKET_NAME=terraformstate-${GCP_PROJECT_ID}

    printf "\nChecking if gs://${TERRAFORM_STATE_BUCKET_NAME} exists"
    CHECK=$(gsutil ls |grep gs://${TERRAFORM_STATE_BUCKET_NAME}/ |wc -l)

    if [ $CHECK -eq 0 ]; then
        printf "\nNot found. Attempting to create the bucket\n"
        gsutil mb gs://${TERRAFORM_STATE_BUCKET_NAME}

        CHECK=$(gsutil ls |grep gs://${TERRAFORM_STATE_BUCKET_NAME}/ |wc -l)
        if [ $CHECK -eq 0 ]; then
            printf "\nFailed to create GCS bucket ${TERRAFORM_STATE_BUCKET_NAME}. Can't continue."
            return 1
        fi
    fi

    printf "\nConfirming we can write to gs://${TERRAFORM_STATE_BUCKET_NAME}\n"
    touch /tmp/newfile
    gsutil cp /tmp/newfile gs://${TERRAFORM_STATE_BUCKET_NAME} >/dev/null 2>&1

    CHECK=$(gsutil ls gs://${TERRAFORM_STATE_BUCKET_NAME}/ |grep newfile |wc -l)
    if [ $CHECK -eq 0 ]; then
        printf "Failed to write to GCS bucket ${TERRAFORM_STATE_BUCKET_NAME}. Can't continue."
        return 1
    fi

    echo "TERRAFORM_STATE_BUCKET_NAME=${TERRAFORM_STATE_BUCKET_NAME}" >>.env_vars
fi


## Create deploy account and keyfile
if [ -z $GCP_DEPLOYMENT_KEYFILE ]; then
    printf "\nCreating new deployment account\n"
    SA=deploy

    gcloud iam service-accounts create $SA  2>/dev/null
    CHECK=$(gcloud iam service-accounts list | grep ${SA}@${GCP_PROJECT_ID}.iam.gserviceaccount.com |wc -l)
    if [ $CHECK -eq 0 ]; then
        printf "Failed to create a deployment account ${SA}@${GCP_PROJECT_ID}.iam.gserviceaccount.com. Can't continue."
        return 1
    fi


    ## Grant project roles to our deploy service account
    SA_ROLES="appengine.appAdmin
              appengine.appCreator
              firebase.admin
              firebase.managementServiceAgent
              storage.admin
              iam.serviceAccountUser
              cloudbuild.builds.editor"

    for ROLE in $SA_ROLES; do
        MEMBER="serviceAccount:${SA}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

        printf "\nGranting role ${ROLE} to ${MEMBER} for project ${GCP_PROJECT_ID}"
        gcloud projects add-iam-policy-binding $GCP_PROJECT_ID --member=$MEMBER --role=roles/$ROLE >/dev/null
        sleep 3
    done


    ## Create a service account keyfile and store locally
    printf "\n\n\nCreating new keyfile for ${SA}@${GCP_PROJECT_ID}.iam.gserviceaccount.com and storing as deploy.keys.json\n"
    gcloud iam service-accounts keys create deploy.keys.json --iam-account=${SA}@${GCP_PROJECT_ID}.iam.gserviceaccount.com

    if [ -f ./deploy.keys.json ]; then
        sudo chmod 777 deploy.keys.json
        
        echo "GCP_DEPLOYMENT_KEYFILE=${WORKDIR}/test/deploy.keys.json" >>.env_vars
        export GCP_DEPLOYMENT_KEYFILE=${WORKDIR}/test/deploy.keys.json
    else
        printf "\n\nCant find keyfile that we should have created. Can't continue.\n"
        return 1
    fi
fi 


## Set Terraform_action
if [ -z $TERRAFORM_ACTION ]; then
    export TERRAFORM_ACTION=apply
    echo "TERRAFORM_ACTION=${TERRAFORM_ACTION}" >>.env_vars
fi






## The following variables will only be known after the first pass of this script. So if this is the first run, 
#  we will set them to junk and update them.
printf "\n\n\n\n ### ADDITONAL VARIABLES ###\n\n"
printf "The next 4 variables will NOT be known the first time you run this script. This is because we first need to create some "
printf "resources, which will then allow us to get the information for these keys."

printf "\n\nFor the next 4 variables, you will be asked if you know the values.\n"
printf "If you do not (which you wont if this is the first time you are running this),\n"
printf "just answer 'N'. We will use a throwaway junk value, which will allow us\n"
printf "to get the first resources deployed.\n\n"
printf "\nOnce we have those resources deployed, then you can get the values for those resources and re-run this script and fill them in."


CONFIRM=N
if [ ! -z ${FB_APP_ID} ]; then
    printf "\n\n\nVariable FB_APP_ID is currently set to ${FB_APP_ID}. Is this correct? (Y/N): "
    read CONFIRM
fi

if [ $CONFIRM != "Y" ]; then
    printf "\nDo you know the value of FB_APP_ID? (Y/N): "
    read CONFIRM

    if [ $CONFIRM == 'Y' ]; then
        printf "\nEnter the value for FB_APP_ID: "
        read FB_APP_ID
        export FB_APP_ID=$FB_APP_ID
    else
        export FB_APP_ID=xxxxxxx
    fi
fi
echo "FB_APP_ID=${FB_APP_ID}" >>.env_vars


CONFIRM=N
if [ ! -z ${FB_API_KEY} ]; then
    printf "\n\nVariable FB_API_KEY is currently set to ${FB_API_KEY}. Is this correct? (Y/N): "
    read CONFIRM
fi

if [ $CONFIRM != "Y" ]; then
    printf "\nDo you know the value of FB_API_KEY? (Y/N): "
    read CONFIRM

    if [ $CONFIRM == 'Y' ]; then
        printf "\nEnter the value for FB_API_KEY: "
        read FB_API_KEY
        export FB_API_KEY=$FB_API_KEY
    else
        export FB_API_KEY=xxxxxxx
    fi
fi
echo "FB_API_KEY=${FB_API_KEY}" >>.env_vars


CONFIRM=N
if [ ! -z ${FB_MESSAGING_SENDER_ID} ]; then
    printf "\n\nVariable FB_MESSAGING_SENDER_ID is currently set to ${FB_MESSAGING_SENDER_ID}. Is this correct? (Y/N): "
    read CONFIRM
fi

if [ $CONFIRM != "Y" ]; then
    printf "\nDo you know the value of FB_MESSAGING_SENDER_ID? (Y/N): "
    read CONFIRM

    if [ $CONFIRM == 'Y' ]; then
        printf "\nEnter the value for FB_MESSAGING_SENDER_ID: "
        read FB_MESSAGING_SENDER_ID
        export FB_MESSAGING_SENDER_ID=$FB_MESSAGING_SENDER_ID
    else
        export FB_MESSAGING_SENDER_ID=xxxxxxx
    fi
fi
echo "FB_MESSAGING_SENDER_ID=${FB_MESSAGING_SENDER_ID}" >>.env_vars



CONFIRM=N
if [ ! -z ${AZURE_TENANT_ID} ]; then
    printf "\n\nVariable AZURE_TENANT_ID is currently set to ${AZURE_TENANT_ID}. Is this correct? (Y/N): "
    read CONFIRM
fi

if [ $CONFIRM != "Y" ]; then
    printf "\nDo you know the value of AZURE_TENANT_ID? (Y/N): "
    read CONFIRM

    if [ $CONFIRM == 'Y' ]; then
        printf "\nEnter the value for AZURE_TENANT_ID: "
        read AZURE_TENANT_ID
        export AZURE_TENANT_ID=$AZURE_TENANT_ID
    else
        export AZURE_TENANT_ID=xxxxxxx
    fi
fi
echo "AZURE_TENANT_ID=${AZURE_TENANT_ID}" >>.env_vars


printf "\n\nThis is all the setup complete. We will use the following variables:\n"
cat .env_vars

printf "\n\nConfirm? (Y/N):"
read CONFIRM

if [ $CONFIRM != "Y" ]; then
    printf "Can't continue"
    return 1
fi

source ${BITBUCKET_CLONE_DIR}/test/run_unattend.sh
