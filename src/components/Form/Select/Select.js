import React, { memo, forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEventListener } from '@/hooks';

import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';
import FieldErrorMessage from '../components/FieldErrorMessage';

import Option from './Option';
import styles from './select.module.scss';

const Select = forwardRef(
  (
    { label, className, onChange, onBlur, meta, input, placeholder, children, onClick, ...rest },
    ref,
  ) => {
    const [hasValue, setValue] = useState(
      rest.value || rest.defaultValue || (input && input.value),
    );

    useEffect(() => {
      setValue(rest.value || rest.defaultValue || (input && input.value));
    }, [rest.value, rest.defaultValue, input]);

    useEventListener('reset', () => {
      setValue('');
    });

    const handleChange = e => {
      if (onChange) {
        onChange(e);
      }
      if (input && input.onChange) {
        input.onChange(e);
      }
    };

    const handleBlur = e => {
      if (onBlur) {
        onBlur(e);
      }
      if (input && input.onBlur) {
        input.onBlur(rest.value || (input && input.value) || '');
      }
    };

    return (
      <FieldContainer className={className}>
        <FieldLabel label={label} required={rest.required} />
        <div className={styles.container} onClick={onClick} aria-hidden="true">
          <select
            {...rest}
            {...input}
            ref={ref}
            onChange={handleChange}
            onBlur={handleBlur}
            className={classNames(
              styles.select,
              hasValue && styles.hasValue,
              meta && meta.touched && meta.error && styles.error,
            )}
            value={rest.value || (input && input.value) || ''}
          >
            {placeholder ? (
              <Option value="" hidden>
                {placeholder}
              </Option>
            ) : null}
            {children}
          </select>
          <i className="icon-arrow-down" />
        </div>
        <FieldErrorMessage message={meta && meta.touched && meta.error} />
      </FieldContainer>
    );
  },
);

Select.defaultProps = {
  className: '',
  label: '',
  children: [],
  required: false,
  value: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  onChange: undefined,
  onBlur: undefined,
  meta: undefined,
  input: undefined,
  onClick: undefined,
};
Select.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.node),
  // redux props
  meta: PropTypes.object,
  input: PropTypes.object,
  onClick: PropTypes.func,
};

export default memo(Select);
