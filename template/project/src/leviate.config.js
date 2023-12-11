export default {
  globalConfig: {
    // Anything here will be accessible via $config in
    // - Vue component templates,
    // - `this` in the Options API
    // inject('$config') in the Composition API
    helpMenu: [
      {
        name: 'product_info',
        url: 'https://www.halfen.com/en_DE/product-ranges/concrete/fixing-systems/cast-in-channels',
      },
      {
        name: 'cad_bim_object_and_software',
        url: 'https://www.halfen.com/en_DE/downloads/software-cad-bim',
      },
      null,
      {
        name: 'product_info',
        url: 'https://www.halfen.com/en_DE/product-ranges/concrete/fixing-systems/cast-in-channels',
      },
      {
        name: 'cad_bim_object_and_software',
        url: 'https://www.halfen.com/en_DE/downloads/software-cad-bim',
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
