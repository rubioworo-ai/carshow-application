terraform {
  backend "azurerm" {
    resource_group_name  = "kml_rg_main-9bbb860c86cc4a4a"
    storage_account_name = "tfst4aadea6c"
    container_name       = "nimbuskeyubio123"
    key                  = "carshowroom/infrastructure.tfstate"
  }
}
