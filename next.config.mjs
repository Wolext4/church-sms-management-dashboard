/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow local network host for HMR/dev resources when developing on other devices
  // Add any dev host (e.g. your LAN IP) to this array to permit cross-origin dev access.
  allowedDevOrigins: ['192.168.0.102'],
}

export default nextConfig
