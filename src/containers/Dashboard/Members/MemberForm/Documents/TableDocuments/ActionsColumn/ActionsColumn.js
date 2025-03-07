import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import ConfirmModal from '@/components/ConfirmModal';

import styles from './actionsColumn.module.scss';

const ActionsColumn = ({ data, downloadButtonProps, deleteButtonProps }) => {
  const [openModal, setOpenModal] = useState(false);
  const intl = useIntl();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleDelete = e => {
    e.preventDefault();
    if (!deleteButtonProps.loading) {
      deleteButtonProps.onClick(data);
    }
  };

  const handleDownload = () => {
    if (!downloadButtonProps.loading) {
      downloadButtonProps.onClick(data);
    }
  };

  return (
    <>
      {!deleteButtonProps.hidden ? (
        <span
          role="presentation"
          className={styles.action}
          onClick={toggleModal}
        >
          {intl.formatMessage({
            id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.ACTIONS.DELETE',
          })}
        </span>
      ) : null}
      {!downloadButtonProps.hidden ? (
        <span
          role="presentation"
          className={classNames(
            styles.action,
            downloadButtonProps.loading && styles.fetching,
          )}
          onClick={handleDownload}
        >
          {intl.formatMessage({
            id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.ACTIONS.DOWNLOAD',
          })}
        </span>
      ) : null}
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{
          onClick: handleDelete,
          loading: deleteButtonProps.loading,
        }}
      >
        {intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.MODAL.DESCRIPTION',
        })}
      </ConfirmModal>
    </>
  );
};

ActionsColumn.propTypes = {
  data: PropTypes.object.isRequired,
  downloadButtonProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    loading: PropTypes.bool,
  }).isRequired,
  deleteButtonProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    loading: PropTypes.bool,
  }).isRequired,
};

export default memo(ActionsColumn);
