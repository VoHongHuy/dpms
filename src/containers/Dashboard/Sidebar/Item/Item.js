import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './item.module.scss';

const Item = ({
  className,
  onClick,
  icon,
  label,
  expand,
  active,
  pathname,
}) => (
  <div
    role="presentation"
    onClick={onClick}
    className={classNames(
      styles.container,
      className,
      expand && styles.expand,
      active && styles.active,
    )}
  >
    <a
      href={pathname}
      className={styles.icon}
      onClick={e => {
        e.preventDefault();
      }}
    >
      <i className={icon} />
    </a>
    <span className={styles.label}>{label}</span>
  </div>
);

Item.defaultProps = {
  className: '',
  pathname: undefined,
  expand: false,
  active: false,
};
Item.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  pathname: PropTypes.string,
  expand: PropTypes.bool,
  active: PropTypes.bool,
};

export default memo(Item);
