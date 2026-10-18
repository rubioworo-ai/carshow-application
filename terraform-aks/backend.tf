terraform {
  backend "azurerm" {
    resource_group_name  = "kml_rg_main-4aadea6c9a11404b"
    storage_account_name = "tfst4aadea6c"
    container_name       = "tfstate"
    key                  = "aks-cluster.tfstate"
  }
}
