import { v4 as uuid } from 'uuid';
import search from '../extensions/search';


function add(el, value) {
  const id = uuid();
  el.setAttribute('data-search-id', id);
  let name = value;
  let keywords = [value];
  if (typeof value !== 'string') {
    name = value.name;
    keywords = value.keywords;
  }
  search.insert(id, name, keywords, el);
}

function remove(el) {
  search.remove(el.getAttribute('data-search-id'));
  el.removeAttribute('data-search-id');
}


export default {
  install(Vue, options) {
    Vue.directive('search', {
      inserted(el, binding) {
        add(el, binding.value);
      },
      updated() {
      },
      componentUpdated(el, binding) {
        remove(el);
        add(el, binding.value);
      },
      unbind(el) {
        remove(el);
      },
    });
  }
}
