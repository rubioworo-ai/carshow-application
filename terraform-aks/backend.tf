terraform {
  backend "azurerm" {
    resource_group_name  = "kml_rg_main-0810375e0ea74db3"
    storage_account_name = "tfst4aadea6c"
    container_name       = "nimbuskeyubio123"
    key                  = "carshowroom/infrastructure.tfstate"
  }
}
