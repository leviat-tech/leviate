import Vue from 'vue';
import bus from './eventBus';


const index = {};


function insert(el, id, before) {
  index[id] = { el, before };
}

function remove(id) {
  delete index[id];
}

function find(id) {
  const { el, before } = index[id];
  if (before) {
    before();
    Vue.nextTick(() => {
      el.scrollIntoView(true);
      el.focus();
    });
  } else {
    el.scrollIntoView(true);
    el.focus();
  }
  bus.$emit('foundElement');
}

export default {
  insert,
  remove,
  find,
};
