resource "azurerm_container_registry" "acr" {
  name                = "nimbusacr${random_string.suffix.result}"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = local.location

  sku           = "Basic"
  admin_enabled = false

  tags = {
    Environment = "Lab"
    ManagedBy   = "Terraform"
  }
}
