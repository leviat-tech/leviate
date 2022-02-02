/* eslint-disable import/no-dynamic-require, global-require, import/no-webpack-loader-syntax */

import Draft from '@crhio/draft';

function read(source) {
  return require(`raw-loader!@/assets/drafts/${source}`).default;
}

function addImports(drawing, imports, loader) {
  imports.forEach(({ name, path }) => {
    const moreImports = drawing.addImport(name, path, loader(path));
    addImports(drawing.imports[name], moreImports);
  });
}

function load(source, params) {
  const draft = Draft();
  const imports = draft.parse(read(source));
  addImports(draft, imports, read);
  draft.loadParameters(params);
  return draft;
}

export default function (source, params) {
  const draft = load(source, params);
  return draft.svg();
}
