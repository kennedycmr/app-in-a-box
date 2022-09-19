#===========================================================
#   General Requirements, define the Google Project
#===========================================================

terraform {
  backend "gcs" {
    # Values configured as part of environment variables in pipeline
  }
}

data "google_project" "google_project" {
  project_id = var.GCP_PROJECT_ID
}


#===========================================================