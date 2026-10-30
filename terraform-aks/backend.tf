terraform {
  backend "azurerm" {
    resource_group_name  = "kml_rg_main-07bb36c80c224d62"
    storage_account_name = "tfst4aadea6c"
    container_name       = "nimbuskeyubio123"
    key                  = "carshowroom/infrastructure.tfstate"
  }
}
