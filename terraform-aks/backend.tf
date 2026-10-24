terraform {
  backend "azurerm" {
    resource_group_name  = "kml_rg_main-3dc61068aef7424e"
    storage_account_name = "tfst4aadea6c"
    container_name       = "nimbuskeyubio123"
    key                  = "carshowroom/infrastructure.tfstate"
  }
}
