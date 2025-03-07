import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

import styles from './customModal.module.scss';

const CustomModal = ({
  className,
  toggle,
  open,
  children,
  cancelButtonProps,
  okButtonProps,
  headerContent,
  buttonGroupProps,
}) => {
  const intl = useIntl();

  return (
    <Modal
      toggle={toggle}
      open={open}
      className={classNames(styles.container, className)}
      headerContent={headerContent}
    >
      <div className={styles.content}>
        <div className={styles.description}>{children}</div>
        <div className={classNames(styles.buttonGroups, buttonGroupProps.className)}>
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

CustomModal.defaultProps = {
  open: false,
  className: '',
  cancelButtonProps: {},
  okButtonProps: {},
  headerContent: undefined,
  buttonGroupProps: {},
};
CustomModal.propTypes = {
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
  headerContent: PropTypes.node,
  buttonGroupProps: PropTypes.shape({
    className: PropTypes.string,
  }),
};

export default memo(CustomModal);
