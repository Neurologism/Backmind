variable "vm_size" {
  description = <<-EOT
    VM size. Downsized from Standard_D2s_v3 (2 vCPU / 8 GiB, ~$90/mo) on
    2026-07-15 to B2als_v2, then again on 2026-07-20 to B2ats_v2 (2 vCPU /
    1 GiB, ~$10/mo): traffic is near zero and nothing memory-heavy runs on
    the box (node app under pm2 + nginx; MongoDB is external — steady state
    uses ~460 MB). A 2 GiB swapfile (/swapfile, in fstab) backstops the
    on-box `pnpm i && pnpm run build` deploys, which will lean on swap at
    this size — expect slow builds; resize up temporarily if that hurts.
    Note: italynorth offers only v2 burstables (no B1ms/B2s), and the VM is
    zonal (zone 1).
  EOT
  type        = string
  default     = "Standard_B2ats_v2"
}
