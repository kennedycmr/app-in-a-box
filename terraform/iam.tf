#===========================================================
#   How to set up IAM in the GCP Project
#   Just add more "google_project_iam_member" with the require role and member
#   https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_iam#google_project_iam_member
#===========================================================

//Grant permissions to the default app engine run account 
//firebase.developAdmin
resource "google_project_iam_member" "developAdmin" {
  project    = data.google_project.google_project.project_id
  role       = "roles/firebase.developAdmin"
  member     = "serviceAccount:${data.google_project.google_project.project_id}@appspot.gserviceaccount.com"
  depends_on = [google_app_engine_application.app]
}

//secretmanager.secretAccessor
resource "google_project_iam_member" "secretAccessor" {
  project    = data.google_project.google_project.project_id
  role       = "roles/secretmanager.secretAccessor"
  member     = "serviceAccount:${data.google_project.google_project.project_id}@appspot.gserviceaccount.com"
  depends_on = [google_project_service.api_appengine]
}

//iam.serviceAccountTokenCreator
resource "google_project_iam_member" "serviceAccountTokenCreator" {
  project    = data.google_project.google_project.project_id
  role       = "roles/iam.serviceAccountTokenCreator"
  member     = "serviceAccount:${data.google_project.google_project.project_id}@appspot.gserviceaccount.com"
  depends_on = [google_project_service.api_appengine]
}

//logging.logWriter
resource "google_project_iam_member" "logWriter" {
  project    = data.google_project.google_project.project_id
  role       = "roles/logging.logWriter"
  member     = "serviceAccount:${data.google_project.google_project.project_id}@appspot.gserviceaccount.com"
  depends_on = [google_project_service.api_appengine]
}