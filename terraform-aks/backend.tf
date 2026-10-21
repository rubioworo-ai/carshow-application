terraform {
  backend "azurerm" {
    resource_group_name  = "kml_rg_main-1ef6f5ecea744eea"
    storage_account_name = "tfst4aadea6c"
    container_name       = "nimbuskeyubio123"
    key                  = "aks-cluster.tfstate"
  }
}
