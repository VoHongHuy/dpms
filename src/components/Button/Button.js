import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './button.module.scss';

const Button = ({
  className,
  children,
  color,
  tag: Component,
  loading,
  disabled,
  ...rest
}) => (
  <Component
    {...rest}
    className={classNames(styles.container, styles[color], className)}
    disabled={disabled || loading}
  >
    {children}
    {loading && <i className={classNames('icon-loader', styles.loadingIcon)} />}
  </Component>
);

Button.defaultProps = {
  className: '',
  tag: 'button',
  loading: false,
  disabled: false,
  color: 'primary',
};
Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  tag: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default memo(Button);
