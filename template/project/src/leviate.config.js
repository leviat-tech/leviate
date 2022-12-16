export default {
  globalConfig: {
    // Anything here will be accessible via $config in
    // - Vue component templates,
    // - `this` in the Options API
    // inject('$config') in the Composition API
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
