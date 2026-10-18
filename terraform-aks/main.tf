data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

locals {
  location = var.location != null ? var.location : data.azurerm_resource_group.rg.location
}

resource "azurerm_virtual_network" "vnet" {
  name                = "nimbus-vnet"
  address_space       = ["10.0.0.0/16", "10.20.0.0/16"]
  location            = local.location
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "nimbus-aks-subnet"
  resource_group_name  = data.azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.20.1.0/24"]
}

resource "azurerm_public_ip" "pip" {
  name                = "nimbus-pip"
  location            = local.location
  resource_group_name = data.azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = local.location
  resource_group_name = data.azurerm_resource_group.rg.name
  dns_prefix          = var.dns_prefix
  oidc_issuer_enabled = true

  default_node_pool {
    name           = var.default_node_pool
    node_count     = 1
    vm_size        = "Standard_D2s_v3"
    vnet_subnet_id = azurerm_subnet.subnet.id
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Production"
    ManagedBy   = "Terraform"
  }

  lifecycle {
    ignore_changes = [
      default_node_pool[0].upgrade_settings
    ]
  }
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

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
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.state_sa.name
  container_access_type = "private"

  lifecycle {
    prevent_destroy = true
  }
}
