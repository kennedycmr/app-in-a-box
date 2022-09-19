#===========================================================
#   Enables Firestore
#   https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/firebase_web_app
#===========================================================


resource "google_project_service" "firestore" {
  project                    = data.google_project.google_project.project_id
  service                    = "firestore.googleapis.com"
  disable_dependent_services = true
}