import find from '../extensions/find';
import search from '../extensions/search';

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
  const entry = vnode.context.$store.getters['search/getEntryFromPath'](id, localize);
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
      inserted(el, binding, vnode) {
        add(el, binding.value, vnode);
      },
      updated() {
      },
      componentUpdated(el, binding, vnode) {
        remove(el);
        add(el, binding.value, vnode);
      },
      unbind(el) {
        remove(el);
      },
    });
  }
}
