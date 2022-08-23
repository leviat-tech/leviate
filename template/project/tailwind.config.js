module.exports = {
  presets: [
    require('@crhio/leviat-tailwind-configuration'),
  ],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './node_modules/@crhio/concrete/**/*.{js,ts,vue,mdx}',
    '../../core/**/*.vue',
  ],
  darkMode: 'media',
  plugins: [
    require('@headlessui/tailwindcss')({ prefix: 'ui' })
  ],
};
