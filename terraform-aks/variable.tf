variable "location" {
  description = "Azure region approved for this deployment. If null, defaults to the resource group's location."
  type        = string
  default     = null
}

variable "resource_group_name" {
  type        = string
  description = "The name of the resource group"
}

variable "default_node_pool" {
  type        = string
  description = "Name of the default node pool"
  default     = "systempool"
}

variable "cluster_name" {
  type        = string
  description = "The name of the Managed Kubernetes Cluster."
  default     = "nimbus-cluster"
}

variable "dns_prefix" {
  type        = string
  description = "DNS prefix specified when creating the managed cluster."
  default     = "nimbuscluster"
}