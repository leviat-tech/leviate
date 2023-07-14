const PRODUCTION_MODE = 'production'

function removeDataTestAttrs(node) {
  const htmlNodeTypes = {
    element: 1,
    attribute: 6
  };

  const attributesToRemove = ['data-cy', ':data-cy'];

  const isElement = node.type === htmlNodeTypes.element;

  if (isElement) {
    node.props = node.props.filter(function (prop) {
      const isAttribute = prop.type === htmlNodeTypes.attribute;

      if (isAttribute) {
        const attributeName = prop.name;

        return !attributesToRemove.includes(attributeName);
      }

      const isDynamicAttribute = prop.name === 'bind';

      if (isDynamicAttribute) {
        const attributeName = prop.arg?.content;

        return !attributesToRemove.includes(attributeName);
      }

      return true;
    });
  }
}

module.exports = function getDefaultTemplateCompilerOptions(mode) {
  return {
    template: {
      compilerOptions: {
        nodeTransforms: mode === PRODUCTION_MODE ? [removeDataTestAttrs] : [],
      },
    }
  }
}