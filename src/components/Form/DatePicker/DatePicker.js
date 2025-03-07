import React, { memo, forwardRef, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { range } from 'lodash';
import DateContext from '@/contexts';
import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';
import FieldErrorMessage from '../components/FieldErrorMessage';

import styles from './datePicker.module.scss';

const currentYear = (new Date()).getFullYear();

const years = range(currentYear - 150, currentYear + 1, 1);

const DatePicker = forwardRef(
  ({ label, className, onChange, onBlur, meta, input, ...rest }, ref) => {
    const { months } = useContext(DateContext);
    const intl = useIntl();
    const dateDisplayFormat = useMemo(() => (rest.showYearPicker ? 'YYYY' : 'DD.MM.YYYY.'), []);

    const getSelectedDateFromValue = () => {
      let result;
      if (rest?.value || rest?.defaultValue || input?.value) {
        const isoDate = moment(rest?.value || rest?.defaultValue || input?.value);
        const croatiaDate = moment(
          rest?.value || rest?.defaultValue || input?.value, dateDisplayFormat, true,
        );
        if (croatiaDate.isValid()) {
          result = croatiaDate.toDate();
        } else if (isoDate.isValid()) {
          result = isoDate.toDate();
        }
      }
      return result;
    };

    const selectedValue = getSelectedDateFromValue();

    const value = selectedValue
      ? moment(selectedValue).format(dateDisplayFormat)
      : '';

    const handleChange = value => {
      let returnValue = value;
      if (rest.showYearPicker) {
        returnValue = moment(value).year();
      }

      if (onChange) {
        onChange(returnValue);
      }
      if (input && input.onChange) {
        input.onChange(returnValue);
      }
    };

    const handleBlur = (e) => {
      if (onBlur) {
        onBlur(e);
      }
      if (input && input.onBlur) {
        input.onBlur(selectedValue);
      }
    };

    return (
      <FieldContainer className={classNames(styles.container, className)}>
        <FieldLabel label={label} required={rest.required} />
        <ReactDatePicker
          {...rest}
          {...input}
          ref={ref}
          autoComplete="off"
          onChange={handleChange}
          onBlur={handleBlur}
          dateFormat="dd.MM.yyyy."
          selected={selectedValue}
          className={classNames(
            styles.datepicker,
            meta && meta.touched && meta.error && styles.error,
          )}
          value={value}
          renderCustomHeader={rest.showYearPicker ? undefined : ({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div
              style={{
                margin: 10,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={event => {
                  event.preventDefault();
                  decreaseMonth(event);
                }}
                disabled={prevMonthButtonDisabled}
              >
                {'<'}
              </button>
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(value)}
              >
                <option value="" hidden>
                  {intl.formatMessage({ id: 'FORM.CONTROL.DATE.YEAR' })}
                </option>
                {years.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))}
              >
                <option value="" hidden>
                  {intl.formatMessage({ id: 'FORM.CONTROL.DATE.MONTH' })}
                </option>
                {months.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                onClick={event => {
                  event.preventDefault();
                  increaseMonth(event);
                }}
                disabled={nextMonthButtonDisabled}
              >
                {'>'}
              </button>
            </div>
          )}
        />
        <FieldErrorMessage message={meta && meta.touched && meta.error} />
      </FieldContainer>
    );
  },
);

DatePicker.defaultProps = {
  className: '',
  label: '',
  required: false,
  value: undefined,
  defaultValue: undefined,
  onChange: undefined,
  onBlur: undefined,
  meta: undefined,
  input: undefined,
};
DatePicker.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.any,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  // redux props
  meta: PropTypes.object,
  input: PropTypes.object,
};

export default memo(DatePicker);
