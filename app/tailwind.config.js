module.exports = {
  presets: [
    require('@crhio/leviat-tailwind-configuration'),
  ],
  content: [
    './index.html',
    '../template/project/src/**/*.{vue,js,ts,jsx,tsx,mdx}',
    '../core/**/*.{js,ts,vue,mdx}',
    '../node_modules/@crhio/concrete/**/*.{js,ts,vue,mdx}',
  ],
  darkMode: 'media',
  plugins: [
    require('@headlessui/tailwindcss')({ prefix: 'ui' })
  ],
};
