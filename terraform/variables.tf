variable "GCP_PROJECT_ID" {
  description = "GCP Project Id"
  type        = string
}

variable "GCP_DEFAULT_REGION" {
  description = "Default region to create resources where applicable."
  type        = string
  default     = "us-east4"
}
