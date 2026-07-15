# One-time import of the pre-existing, portal-created server (2026-02-04) into
# terraform. Safe to delete this file once the first apply has completed.

locals {
  sub = "/subscriptions/48317e81-bf0f-4424-8f69-c8513c91c001"
  rg  = "${local.sub}/resourceGroups/test-vm_group"
}

import {
  to = azurerm_resource_group.main
  id = local.rg
}

import {
  to = azurerm_virtual_network.main
  id = "${local.rg}/providers/Microsoft.Network/virtualNetworks/vnet-italynorth"
}

import {
  to = azurerm_subnet.main
  id = "${local.rg}/providers/Microsoft.Network/virtualNetworks/vnet-italynorth/subnets/snet-italynorth-1"
}

import {
  to = azurerm_network_security_group.main
  id = "${local.rg}/providers/Microsoft.Network/networkSecurityGroups/backmind-nsg"
}

import {
  to = azurerm_public_ip.main
  id = "${local.rg}/providers/Microsoft.Network/publicIPAddresses/backmind-ip"
}

import {
  to = azurerm_network_interface.main
  id = "${local.rg}/providers/Microsoft.Network/networkInterfaces/backmind914_z1"
}

import {
  to = azurerm_network_interface_security_group_association.main
  id = "${local.rg}/providers/Microsoft.Network/networkInterfaces/backmind914_z1|${local.rg}/providers/Microsoft.Network/networkSecurityGroups/backmind-nsg"
}

import {
  to = azurerm_ssh_public_key.backmind
  id = "${local.rg}/providers/Microsoft.Compute/sshPublicKeys/backmind_key"
}

import {
  to = azurerm_ssh_public_key.yoga
  id = "${local.rg}/providers/Microsoft.Compute/sshPublicKeys/yogaKey"
}

import {
  to = azurerm_linux_virtual_machine.main
  id = "${local.rg}/providers/Microsoft.Compute/virtualMachines/backmind"
}
