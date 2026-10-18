output "kubernetes_cluster_name" {
  description = "The name of the managed Kubernetes cluster."
  value       = azurerm_kubernetes_cluster.aks.name
}

output "cluster_resource_group" {
  description = "The resource group where the AKS cluster is deployed."
  value       = data.azurerm_resource_group.rg.name
}

output "client_certificate" {
  description = "Base64 encoded public certificate used by clients to authenticate to the cluster API server."
  value       = azurerm_kubernetes_cluster.aks.kube_config[0].client_certificate
  sensitive   = true
}

output "kube_config" {
  description = "Raw Kubernetes configuration string for kubectl access."
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}

output "storage_account_name" {
  value = azurerm_storage_account.state_sa.name
}
