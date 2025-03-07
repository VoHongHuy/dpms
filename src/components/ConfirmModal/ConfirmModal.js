import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

import styles from './confirmModal.module.scss';

const ConfirmModal = ({
  className,
  toggle,
  open,
  children,
  cancelButtonProps,
  okButtonProps,
}) => {
  const intl = useIntl();

  return (
    <Modal
      toggle={toggle}
      open={open}
      className={classNames(styles.container, className)}
    >
      <div className={styles.warning}>
        <i className={classNames('icon-warning', styles.icon)} />
      </div>
      <div className={styles.content}>
        <div className={styles.description}>{children}</div>
        <div className={styles.buttonGroups}>
          <Button
            {...okButtonProps}
            className={classNames(styles.button, okButtonProps.className)}
          >
            {okButtonProps.children ||
              intl.formatMessage({
                id: 'MEMBERS.EDIT_MEMBER.DELETE.BUTTON.YES',
              })}
          </Button>
          <Button
            {...cancelButtonProps}
            color="secondary"
            className={classNames(styles.button, cancelButtonProps.className)}
            onClick={cancelButtonProps.onClick || toggle}
          >
            {cancelButtonProps.children ||
              intl.formatMessage({
                id: 'MEMBERS.EDIT_MEMBER.DELETE.BUTTON.NO',
              })}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmModal.defaultProps = {
  open: false,
  className: '',
  cancelButtonProps: {},
  okButtonProps: {},
};
ConfirmModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  cancelButtonProps: PropTypes.shape({
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
  }),
  okButtonProps: PropTypes.shape({
    className: PropTypes.string,
    children: PropTypes.node,
  }),
  open: PropTypes.bool,
  className: PropTypes.string,
};

export default memo(ConfirmModal);
