/**
 * @function filterDataByObject
 * @param {Array} data - original data
 * @param {Object} filters - criteria filters
 * @returns data filtered
 */
const filterDataByObject = (data, filters) => {
  const filterKeys = Object.keys(filters);
  if (filterKeys.length === 0) return data;

  return data.filter(item =>
    filterKeys.every(k => {
      if (!filters[k]) {
        return true;
      }

      if (Array.isArray(filters[k]) && filters[k].length > 0) {
        return filters[k].includes(item[k]);
      }

      if (typeof item[k] === 'string' && !Array.isArray(filters[k])) {
        return item[k].toLowerCase().includes(filters[k].toLowerCase());
      }

      return item[k] === filters[k];
    }),
  );
};

export default filterDataByObject;
