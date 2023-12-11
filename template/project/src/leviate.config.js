export default {
  globalConfig: {
    // Anything here will be accessible via $config in
    // - Vue component templates,
    // - `this` in the Options API
    // inject('$config') in the Composition API
    helpMenu: [
      // Example:
      // normal link
      {
        name: 'translate_key_1',
        url: 'https://www.example1.com',
      },
      // Link with icon
      {
        icon: 'expand', // CIcon "type" prop
        name: 'translate_key_2',
        url: 'https://www.example2.com',
      },
      // renders a divider
      null,
      // Link with custom classes
      {
        className: 'bg-blue-500 text-white',
        name: 'translate_key_3',
        url: 'https://www.example3.com',
      },
    ],
  },
  endpoints: {
    calc: import.meta.env.VITE_API_CALC,
    pdf: import.meta.env.VITE_API_DOC,
  },
  plugins: [
    // You can also pass options using an array e.g. [MyPlugin, myPluginConfig]
  ],
  concreteOptions: {
    // You can override any of the concrete options here e.g. registerInputs: true
  },
  isHosted: false
};
