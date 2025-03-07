import React, { memo, forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import classNames from 'classnames';
import { useEventListener } from '@/hooks';
import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';
import FieldErrorMessage from '../components/FieldErrorMessage';
import styles from './autoCompleteSelect.module.scss';

const AutoCompleteSelect = forwardRef(
  (
    {
      label,
      options,
      className,
      onChange,
      onBlur,
      meta,
      input,
      placeholder,
      isDisabled,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const [value, setValue] = useState(null);

    useEffect(() => {
      setValue(rest.value || rest.defaultValue || (input && input.value));
    }, [
      rest.value,
      rest.defaultValue,
      input,
      options,
    ]);

    useEventListener('reset', () => {
      setValue(null);
    });

    const handleChange = selectedOptions => {
      if (onChange) {
        onChange(selectedOptions);
      }
      if (input && input.onChange) {
        input.onChange(selectedOptions);
      }
    };

    const handleBlur = (selectedOptions) => {
      if (onBlur) {
        onBlur(selectedOptions);
      }

      if (input && input.onBlur) {
        input.onBlur(value);
      }
    };

    return (
      <FieldContainer className={`${className} ${styles.autoOverflow}`}>
        <FieldLabel label={label} required={rest.required} />
        <div
          className={classNames(styles.container, isDisabled && styles.disabled)}
          onClick={onClick}
          aria-hidden="true"
        >
          <Select
            {...rest}
            {...input}
            ref={ref}
            onChange={handleChange}
            onBlur={handleBlur}
            classNamePrefix="custom-select"
            className={classNames(
              'custom-select-container',
              styles.select,
              value && styles.hasValue,
              meta && meta.touched && meta.error && styles.error,
            )}
            options={options}
            value={value}
            placeholder={placeholder}
            isDisabled={isDisabled}
          />
        </div>
        <FieldErrorMessage message={meta && meta.touched && meta.error} />
      </FieldContainer>
    );
  },
);

AutoCompleteSelect.defaultProps = {
  className: '',
  label: '',
  options: [],
  required: false,
  value: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  onChange: undefined,
  onBlur: undefined,
  meta: undefined,
  input: undefined,
  isDisabled: false,
  onClick: undefined,
};

AutoCompleteSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.object),
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  isDisabled: PropTypes.bool,
  // redux props
  meta: PropTypes.object,
  input: PropTypes.object,
  onClick: PropTypes.func,
};

export default memo(AutoCompleteSelect);
