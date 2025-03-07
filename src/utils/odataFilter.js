/**
 * @description compile a filter object to odata query string
 * @function compileOdataFilter
 * @param {Object} filtersObj - criteria filters
 * @example filtersObj = {
 *    name: 'abc',
 *    email: 'abc',
 *    number: 1,
    }
 * @param {Object} queryTypeObj - optional.
    Define odata query. Default query type is 'contains'
 * @example queryTypeObject = {
 *    name: 'contains',
 *    email: 'contains',
 *    number: 'equal',
    }
 * @returns string query
 * @example'contains(name, 'abc') eq true and contains(email, 'abc') eq true
 *  and contains(email, 'abc') eq true'
 */

const types = {
  contains: 'contains',
  containsCaseInsensitive: 'containsCI',
  equal: 'equal',
  le: 'le',
  ge: 'ge',
  notEqual: 'notEqual',
};

const queries = {
  [types.contains]: (key, value) => `contains(${key}, '${value}') eq true`,
  [types.containsCaseInsensitive]: (key, value) =>
    `contains(tolower(${key}), '${value?.toLowerCase()}') eq true`,
  [types.equal]: (key, value) =>
    `${key} eq ${typeof value === 'string' && !value.includes('\'') ? `'${value}'` : value}`,
  [types.notEqual]: (key, value) =>
    `${key} ne ${typeof value === 'string' ? `'${value}'` : value}`,
  [types.le]: (key, value) => `${key} le ${value}`,
  [types.ge]: (key, value) => `${key} ge ${value}`,
};

const compile = (filtersObj, queryTypeObj = {}, mapObject = {}) => {
  const filtersOdata = {};
  const filterKeys = Object.keys(filtersObj);
  if (filterKeys.length > 0) {
    const queryFilters = [];
    filterKeys
      .map(key => key)
      .forEach(key => {
        const type = queryTypeObj[key] || types.contains;
        const filter = filtersObj[key];
        if (filter !== undefined && filter !== '') {
          if (Array.isArray(filter)) {
            if (filter.length > 0) {
              const subQueries = [];
              filter.forEach(element => {
                subQueries.push(queries[type](mapObject[key] ?? key, element));
              });
              const subQueryFilters = `(${subQueries.join(' or ')})`;
              queryFilters.push(subQueryFilters);
            }
          } else {
            queryFilters.push(queries[type](mapObject[key] ?? key, filter));
          }
        }
      });

    if (queryFilters.length > 0) {
      filtersOdata.$filter = queryFilters.join(' and ');
    }
  }

  return filtersOdata;
};

export default {
  compile,
  types,
};
