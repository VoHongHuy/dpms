import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FieldContainer from '../components/FieldContainer';
import FieldLabel from '../components/FieldLabel';
import FieldErrorMessage from '../components/FieldErrorMessage';

import styles from './textArea.module.scss';

const TextArea = forwardRef(
  ({ label, className, meta, input, onChange, ...rest }, ref) => {
    const handleChange = value => {
      if (onChange) {
        onChange(value);
      }
      if (input && input.onChange) {
        input.onChange(value);
      }
    };

    return (
      <FieldContainer className={className}>
        <FieldLabel label={label} required={rest.required} />
        <textarea
          {...rest}
          {...input}
          ref={ref}
          onChange={handleChange}
          className={classNames(
            styles.textarea,
            meta && meta.touched && meta.error && styles.error,
          )}
          value={rest.value || (input && input.value) || ''}
          selected={rest?.value || rest?.defaultValue || input?.value}
        />
        <FieldErrorMessage message={meta && meta.touched && meta.error} />
      </FieldContainer>
    );
  },
);

TextArea.defaultProps = {
  className: '',
  label: '',
  required: false,
  onChange: undefined,
  meta: undefined,
  input: undefined,
};
TextArea.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  // redux props
  meta: PropTypes.object,
  input: PropTypes.object,
};

export default memo(TextArea);
