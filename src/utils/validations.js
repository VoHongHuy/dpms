const containLowerCharacter = value => new RegExp('^(?=.*[a-z])').test(value);
const containUpperCharacter = value => new RegExp('^(?=.*[A-Z])').test(value);
const containSpecialCharacter = value =>
  new RegExp('^(?=.*[!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~])').test(value);
const containNumber = value => new RegExp('^(?=.*[0-9])').test(value);
const length = (value, compareValue) => String(value).length === compareValue;
const minLength = (value, min) => new RegExp(`^(?=.{${min},})`).test(value);
const maxLength = (value, max) => new RegExp(`^(?=.{0,${max}}$)`).test(value);
const min = (value, compareValue) => Number(value) >= compareValue;
const max = (value, compareValue) => Number(value) <= compareValue;

const email = value => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
const password = value =>
  new RegExp(
    // eslint-disable-next-line max-len
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~])(?=.{8,})',
  ).test(value);
const ssn = value => {
  const ssnLength = 11;
  if (!value || !length(value, ssnLength)) return false;
  const digits = value.split('').map(Number);
  let i = 0;
  let sum = 10;

  while (i < ssnLength - 1) {
    sum += digits[i];
    sum = sum % 10 === 0 ? 10 : sum % 10;
    sum *= 2;
    sum %= 11;
    i += 1;
  }

  const controlDigit = 11 - sum === 10 ? 0 : 11 - sum;
  return controlDigit === digits[ssnLength - 1];
};

export default {
  email,
  password,
  ssn,
  length,
  minLength,
  maxLength,
  min,
  max,
  containNumber,
  containLowerCharacter,
  containUpperCharacter,
  containSpecialCharacter,
};
