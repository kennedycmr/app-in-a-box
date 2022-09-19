#===========================================================
#   How to create and manage App Engine in GCP
#   https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/app_engine_application
#===========================================================

resource "google_app_engine_application" "app" {
  project       = data.google_project.google_project.project_id
  location_id   = "us-east4"
  database_type = "CLOUD_FIRESTORE"

  depends_on = [google_project_service.api_appengine]
}
