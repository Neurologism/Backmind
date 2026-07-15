variable "vm_size" {
  description = <<-EOT
    VM size. Downsized from Standard_D2s_v3 (2 vCPU / 8 GiB, ~$90/mo) on
    2026-07-15: traffic is near zero and nothing memory-heavy runs on the box
    (node app under pm2 + nginx; MongoDB is external). B2als_v2 keeps 2 vCPU
    and 4 GiB — enough headroom for the on-box `pnpm i && pnpm run build`
    deploys — at roughly a third of the cost. Note: italynorth offers only
    v2 burstables (no B1ms/B2s), and the VM is zonal (zone 1).
  EOT
  type        = string
  default     = "Standard_B2als_v2"
}
