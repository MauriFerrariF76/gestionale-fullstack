import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurazione per risolvere il warning cross-origin
  allowedDevOrigins: [
    '10.10.10.15',
    'localhost',
    '127.0.0.1',
    '10.10.10.0/24', // Tutta la rete 10.10.10.x
  ],
  /* config options here */
};

export default nextConfig;
