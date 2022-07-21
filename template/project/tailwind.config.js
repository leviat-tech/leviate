module.exports = {
  presets: [
    require('@crhio/leviat-tailwind-configuration'),
  ],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './node_modules/@crhio/concrete/src/**/*.{js,ts,vue,mdx}',
  ],
  darkMode: 'media',
  plugins: [
    require('@headlessui/tailwindcss')({ prefix: 'ui' })
  ],
};
