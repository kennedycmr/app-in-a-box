#===========================================================
#   How to Manage APIs inside a Google Project with Terraform
#===========================================================


resource "google_project_service" "api_serviceusage" {
  project = data.google_project.google_project.project_id
  service = "serviceusage.googleapis.com"
}

resource "google_project_service" "api_resourcemanager" {
  project = data.google_project.google_project.project_id
  service = "cloudresourcemanager.googleapis.com"
}

resource "google_project_service" "api_appengine" {
  project = data.google_project.google_project.project_id
  service = "appengine.googleapis.com"
}

resource "google_project_service" "api_firebase" {
  project = data.google_project.google_project.project_id
  service = "firebase.googleapis.com"
}

resource "google_project_service" "api_secretmanager" {
  project = data.google_project.google_project.project_id
  service = "secretmanager.googleapis.com"
}

resource "google_project_service" "api_iamcredentials" {
  project = data.google_project.google_project.project_id
  service = "iamcredentials.googleapis.com"
}

resource "google_project_service" "api_containerregistry" {
  project = data.google_project.google_project.project_id
  service = "containerregistry.googleapis.com"
}

#===========================================================