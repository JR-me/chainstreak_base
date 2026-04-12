/** @type {import('next').NextConfig} */

// ── GitHub Pages only ──────────────────────────────────────────────────────
// Only used by `npm run build:github`. Change this to your repo name if it
// isn't "chainstreak". Vercel and Netlify never use basePath, so leave it.
const GITHUB_REPO_NAME = "chainstreak";

const isGitHub = process.env.BUILD_TARGET === "github";

const nextConfig = {
  output: "export",       // Static HTML export for all three hosts
  trailingSlash: true,    // Required: Netlify & GitHub Pages need index.html in each folder
  images: {
    unoptimized: true,    // No server-side image optimisation in static mode
  },
  ...(isGitHub && {
    basePath: `/${GITHUB_REPO_NAME}`,
    assetPrefix: `/${GITHUB_REPO_NAME}/`,
  }),
};

module.exports = nextConfig;
