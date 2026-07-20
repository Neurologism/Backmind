# Backmind backend server — imported from the portal-created resources
# (2026-02-04) so the box is terraform-managed from here on.
#
# Naming oddities are historical: the resource group is named "test-vm_group"
# and sits in switzerlandnorth, while every actual resource lives in
# italynorth. Renaming either would force destroy/recreate, so they stay.

locals {
  location = "italynorth"
}

resource "azurerm_resource_group" "main" {
  name     = "test-vm_group"
  location = "switzerlandnorth"
}

# ---------------------------------------------------------------------------
# Network
# ---------------------------------------------------------------------------

resource "azurerm_virtual_network" "main" {
  name                = "vnet-italynorth"
  location            = local.location
  resource_group_name = azurerm_resource_group.main.name
  address_space       = ["172.16.0.0/16"]
}

resource "azurerm_subnet" "main" {
  name                 = "snet-italynorth-1"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["172.16.0.0/24"]
}

resource "azurerm_network_security_group" "main" {
  name                = "backmind-nsg"
  location            = local.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "SSH"
    priority                   = 300
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "http"
    priority                   = 310
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_ranges    = ["443", "80"]
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_public_ip" "main" {
  name                = "backmind-ip"
  location            = local.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                 = "Standard"
  zones               = ["1"]
}

resource "azurerm_network_interface" "main" {
  name                           = "backmind914_z1"
  location                       = local.location
  resource_group_name            = azurerm_resource_group.main.name
  accelerated_networking_enabled = true

  ip_configuration {
    name                          = "ipconfig1"
    primary                       = true
    subnet_id                     = azurerm_subnet.main.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.main.id
  }
}

resource "azurerm_network_interface_security_group_association" "main" {
  network_interface_id      = azurerm_network_interface.main.id
  network_security_group_id = azurerm_network_security_group.main.id
}

# ---------------------------------------------------------------------------
# SSH keys (as uploaded via the portal)
# ---------------------------------------------------------------------------

resource "azurerm_ssh_public_key" "backmind" {
  name                = "backmind_key"
  location            = local.location
  resource_group_name = azurerm_resource_group.main.name
  public_key          = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDpyw6ufLvuyoAB/nblsAXXnLN9YsP8Vs+r24uhCRDU6WNoeJlNVriZDKMAVq4u1BjrZ/QBeUzCp9l9o5UwyMcECOc3nIWYw+aY22R8PNnx6CGp0rIR9LaWnGKixb3skqCaaMr9FuPDODKvQEwBvfWx3Hsjd+I4oGPDaqErmzAYGvKCy2poYHh6zSRw3Hhr1HpuSAdKLAvw+59p271i+hmqVK1SP6NcmIri3pd1Q11FMBytKyPmgtM8NYH5zcCRIqOWsLJT+3nKOL5sMNx/AIFfBYdxMe9Sj5lpkMYPnNvNhcB9SFAWSkWWdEyq2HRMjnba5R8Z/tScDQfivYJ1cuI0SqfpIxg6NkgdhdR4v43M8un4eQZYxORx+A4T2LOuUVycFSN+T81Kvuy1hP1ywSKOfLmB2PT+q3BPY4FcL0+01j4RnKwFg2VnvMAPP7ucJsMy640IxtgiTa+E7kaIhgxLRJxvERzt53qJJ9x8NWKTMzsA/Q0oFKUuWjAsvLDNCd0= generated-by-azure"
}

resource "azurerm_ssh_public_key" "yoga" {
  name                = "yogaKey"
  location            = local.location
  resource_group_name = azurerm_resource_group.main.name
  public_key          = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILJGQSIEklD0jVHT/68Jf249mQXwsyqMVSRZucBb7QxH generated-by-azure"
}

# ---------------------------------------------------------------------------
# Virtual machine
# ---------------------------------------------------------------------------

resource "azurerm_linux_virtual_machine" "main" {
  name                = "backmind"
  computer_name       = "backmind"
  location            = local.location
  resource_group_name = azurerm_resource_group.main.name
  size                = var.vm_size
  zone                = "1"

  admin_username                  = "azureuser"
  disable_password_authentication = true

  admin_ssh_key {
    username   = "azureuser"
    public_key = azurerm_ssh_public_key.backmind.public_key
  }

  network_interface_ids = [azurerm_network_interface.main.id]

  os_disk {
    # Name is fixed by the original portal deployment; changing it would
    # recreate the disk.
    name                 = "backmind_OsDisk_1_9eca476daf194611a2e7b0d7f6252101"
    caching              = "ReadWrite"
    # Premium_LRS -> StandardSSD_LRS 2026-07-20; near-zero traffic doesn't
    # justify premium IOPS (~$3/mo saved).
    storage_account_type = "StandardSSD_LRS"
    disk_size_gb         = 30
  }

  source_image_reference {
    publisher = "canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }

  secure_boot_enabled = true
  vtpm_enabled        = true

  boot_diagnostics {}
}
