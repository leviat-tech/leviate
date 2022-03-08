import find from '../extensions/find';
import search from '../extensions/search';
import store from '@/store';


function add(el, value) {
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
  const entry = store.getters['search/getEntryFromPath'](id, localize);
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
  install(Vue, options) {
    Vue.directive('find', {
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
