/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingExcludes: {
    "*": ["*/vendored/contexts/amp-context.shared-runtime.js"],
  },
};

export default nextConfig;
