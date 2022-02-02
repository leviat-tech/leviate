import Vue from 'vue';
import range from 'lodash/range';
import get from 'lodash/get';
import last from 'lodash/last';
import KModel from '@/models/k-model';


const getters = {
  getEntryFromPath(s, g, rootS, rootG) {
    const $l = Vue.prototype.$l;
    return (path, localize = true) => {
      const current = rootG.current;
      if (!path) return current.name;

      const allSubpaths = range(path.length)
        .filter((i) => path[i] === '.')
        .map((i) => path.slice(0, i));

      const entitySubpaths = allSubpaths.filter((subpath) => get(current, subpath) instanceof KModel);
      const entityPath = entitySubpaths.map((subpath) => get(current, subpath));
      const displayPath = entityPath.map((entity) => entity.name).join(' > ');

      const entity = last(entityPath) || current;
      const termPath = entitySubpaths ? path.replace(last(entitySubpaths), '') : path;

      let term;
      if (get(current, path) instanceof KModel) {
        term = get(current, path).name;
      } else {
        term = entity.coercedSchema.getSearchTerm(termPath);
        if (localize) {
          term = $l(term, { capitalize: true });
        }
      }
      return displayPath ? `${term} (${displayPath})` : term;
    };
  },
};

const search = { namespaced: true, getters };
export default search;
