resource "azurerm_storage_account" "state_sa" {
  name                     = "tfst4aadea6c"
  resource_group_name      = data.azurerm_resource_group.rg.name
  location                 = local.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    environment = "staging"
    ManagedBy   = "Terraform"
  }
}

resource "azurerm_storage_container" "state_container" {
  name                  = "nimbuskeyubio123"
  storage_account_name  = azurerm_storage_account.state_sa.name
  container_access_type = "private"

  lifecycle {
    prevent_destroy = true
  }
}
