terraform {
  backend "azurerm" {
    resource_group_name  = "kml_rg_main-3b87bfae25b043ba"
    storage_account_name = "tfst4aadea6c"
    container_name       = "nimbuskeyubio123"
    key                  = "aks-cluster.tfstate"
    use_oidc             = true
  }
}
