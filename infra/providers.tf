terraform {
  required_version = ">= 1.8.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}

  # Personal subscription (not a secret; resource IDs embed it anyway).
  subscription_id                 = "48317e81-bf0f-4424-8f69-c8513c91c001"
  resource_provider_registrations = "none"
}
