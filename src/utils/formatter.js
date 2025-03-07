export default {
  number: {
    hr: value => new Intl.NumberFormat('hr-HR').format(value),
  },
};
