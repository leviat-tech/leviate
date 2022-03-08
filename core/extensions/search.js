// the index isn't currently on the state because we need to index elements that arent serializable
// obviously this search can be optimized!!

const index = {};

// key is a unique id for this result
// name is a short label for this result
// keywords is a list of terms that will be indexed to match this result
// el is the search result (in our case usually a dom element)

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
