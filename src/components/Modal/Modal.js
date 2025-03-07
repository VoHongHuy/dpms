import React, { useEffect, memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import CloseButton from './CloseButton';
import styles from './modal.module.scss';

const Modal = ({
  className,
  open,
  toggle,
  size,
  hideCloseButton,
  children,
  headerContent,
}) => {
  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    if (open) {
      body.style.overflow = 'hidden';
    } else {
      body.removeAttribute('style');
    }

    return () => {
      body.removeAttribute('style');
    };
  }, [open]);

  return open ? (
    <div className={classNames(styles.container, open && styles.open)}>
      <div className={classNames(styles.content, styles[size], className)}>
        {headerContent && (
          <div className={styles.header}>
            {headerContent}
          </div>
        )}
        {!hideCloseButton && <CloseButton onClick={toggle} />}
        {children}
      </div>
    </div>
  ) : null;
};
Modal.propTypes = {
  toggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hideCloseButton: PropTypes.bool,
  open: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  headerContent: PropTypes.node,
};
Modal.defaultProps = {
  className: '',
  hideCloseButton: false,
  open: false,
  size: 'md',
  headerContent: undefined,
};

export default memo(Modal);
