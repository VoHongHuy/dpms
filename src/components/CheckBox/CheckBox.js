import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './checkBox.module.scss';

const CheckBox = forwardRef(
  ({ className, id, label, onChange, meta, input, labelColor, ...rest }, ref) => {
    const name = rest.name || input.name;

    const handleChange = e => {
      if (onChange) {
        onChange(e);
      }
      if (input && input.onChange) {
        input.onChange(e);
      }
    };

    return (
      <div className={classNames(styles.container, className)}>
        <input
          {...rest}
          {...input}
          id={id || `${name}-${label}`}
          type="checkbox"
          ref={ref}
          name={name}
          className={styles.input}
          onChange={handleChange}
          checked={rest.checked || (input && input.value) || false}
        />
        <label
          htmlFor={id || `${name}-${label}`}
          className={classNames(styles.label, styles[labelColor])}
        >
          {label}
        </label>
      </div>
    );
  },
);

CheckBox.defaultProps = {
  className: '',
  labelColor: '',
  id: '',
  onChange: undefined,
  meta: undefined,
  input: undefined,
};
CheckBox.propTypes = {
  className: PropTypes.string,
  labelColor: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  // redux props
  meta: PropTypes.object,
  input: PropTypes.object,
};

export default memo(CheckBox);
