// import { nextTick } from 'vue';
// import bus from './eventBus';


const index = {};

function insert(el, id, before) {
  index[id] = { el, before };
}

function remove(id) {
  delete index[id];
}

async function find(id) {
  const { el, before } = index[id];
  if (before) {
    before();
    await nextTick();
  }

  el.scrollIntoView(true);
  el.focus();
  bus.emit('foundElement');
}

export default {
  insert,
  remove,
  find,
};
