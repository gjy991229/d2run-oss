/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Performance optimization: use faster CSS generation
  // Only include styles that are actually used in the codebase
  safelist: [],
  // Minimize CSS output in production
  corePlugins: {
    // Disable unused core plugins if needed
  },
}