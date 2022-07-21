// the index isn't in the state because we need to index elements that aren't serializable
// TODO: optimise search

const index = {};

/**
 * @param {HTMLElement} el - the search result, a dom element
 * @param {string} key - the unique id for the search result
 * @param {string} name - a short label for this result
 * @param {Array} keywords - a list of terms that will be indexed to match this result
 */
function insert(el, key, name, keywords) {
  index[key] = {
    el,
    key,
    name,
    keywords,
  };
}

function remove(key) {
  delete index[key];
}

function match(query) {
  const matches = Object.values(index).filter((item) => {
    const matchingTerms = item.keywords.filter((term) => term.toLowerCase().includes(query.toLowerCase()));
    return matchingTerms.length > 0;
  });
  return matches;
}

export default {
  match,
  insert,
  remove,
};
