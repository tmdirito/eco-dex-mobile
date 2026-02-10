/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Tells Next.js to produce a static HTML folder
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;