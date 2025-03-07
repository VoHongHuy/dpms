import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './fieldLabel.module.scss';

const FieldLabel = ({ label, className, required }) =>
  (label ? (
    <p
      className={classNames(
        styles.label,
        className,
        required && styles.required,
      )}
    >
      {label}
    </p>
  ) : null);

FieldLabel.defaultProps = {
  label: undefined,
  className: '',
  required: false,
};
FieldLabel.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
  required: PropTypes.bool,
};

export default memo(FieldLabel);
