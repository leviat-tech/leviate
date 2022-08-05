import find from '../extensions/find';
import search from '../extensions/search';
import { useLocalize } from '../plugins/host';
import BaseModel from '../BaseModel';
import { range, get, last } from 'lodash-es';


function getEntryFromPath(path, localize = true) {
  const $l = useLocalize();
  const current = rootG.current;
  if (!path) return current.name;

  const allSubpaths = range(path.length)
    .filter((i) => path[i] === '.')
    .map((i) => path.slice(0, i));

  const entitySubpaths = allSubpaths.filter((subpath) => get(current, subpath) instanceof BaseModel);
  const entityPath = entitySubpaths.map((subpath) => get(current, subpath));
  const displayPath = entityPath.map((entity) => entity.name).join(' > ');

  const entity = last(entityPath) || current;
  const termPath = entitySubpaths ? path.replace(last(entitySubpaths), '') : path;

  let term;
  if (get(current, path) instanceof BaseModel) {
    term = get(current, path).name;
  } else {
    term = entity.coercedSchema.getSearchTerm(termPath);
    if (localize) {
      term = $l(term, { capitalize: true });
    }
  }
  return displayPath ? `${term} (${displayPath})` : term;
}

function add(el, value, vnode) {
  let id;
  let before;
  let localize = true;
  if (typeof value === 'string') {
    id = value;
  } else {
    id = value.id;
    before = value.before;
    localize = value.localize;
  }
  el.setAttribute('data-find-id', id);
  const entry = getEntryFromPath(id, localize);
  find.insert(el, id, before);
  search.insert(el, id, entry, [entry]);
}

function remove(el) {
  const id = el.getAttribute('data-find-id');
  find.remove(id);
  search.remove(id);
  el.removeAttribute('data-find-id');
}


export default {
  install(app, options) {
    app.directive('find', {
      mounted(el, binding, vnode) {
        add(el, binding.value, vnode);
      },
      updated(el, binding, vnode) {
        remove(el);
        add(el, binding.value, vnode);
      },
      unmounted(el) {
        remove(el);
      },
    });
  }
}
