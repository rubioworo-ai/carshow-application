data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "key_vault" {
  name                = "nimbus-keyvault-2026"
  location            = local.location
  resource_group_name = data.azurerm_resource_group.rg.name

  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get",
      "List"
    ]
  }

  tags = {
    Environment = "Lab"
    ManagedBy   = "Terraform"
  }
}
