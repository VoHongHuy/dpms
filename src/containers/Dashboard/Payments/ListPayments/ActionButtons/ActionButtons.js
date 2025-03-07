import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { submit } from 'redux-form';
import Button from '@/components/Button';
import { useIntl } from 'react-intl';
import CustomModal from '@/components/CustomModal';
import { FileUpload } from '@/components/Form';
import { MEMBERSHIP_SETTING_FORM } from '@/constants/forms';
import {
  fetchMembershipSettings,
  importPayments,
  updateMembershipSettings } from '@/redux/ducks/payments.duck';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import MembershipSettings from './MembershipSettingsModal';

import styles from './actionButton.module.scss';

const ActionButtons = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMembershipSettings());
  }, []);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleFileUploadClick = files => {
    dispatch(importPayments({ files, intl }));
  };

  const handleFormSubmit = formValues => {
    setLoading(true);
    dispatch(
      updateMembershipSettings({
        data: {
          ...formValues,
        },
        callback: () => {
          toggleModal(false);
          setLoading(false);
        },
      }),
    );
  };

  const handleModalOk = () => {
    dispatch(submit(MEMBERSHIP_SETTING_FORM));
  };

  return (
    <div className={styles.container}>
      {hasPermissions([PERMISSIONS.IMPORT_PAYMENT.value]) && (
        <FileUpload
          className={`${styles.button} ${styles.import}`}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
          application/vnd.ms-excel"
          onUpload={handleFileUploadClick}
        >
          {intl.formatMessage({
            id: 'PAYMENTS.LIST_PAYMENTS.ACTION.PAYMENTS_IMPORT',
          })}
        </FileUpload>
      )}
      {hasPermissions([PERMISSIONS.UPDATE_PAYMENT.value]) && (
        <Button
          onClick={e => {
            e.preventDefault();
            toggleModal();
          }}
          className={`${styles.button} ${styles.settings}`}
        >
          {intl.formatMessage({
            id: 'PAYMENTS.LIST_PAYMENTS.ACTION.MEMBERSHIP_SETTINGS',
          })}
        </Button>
      )}
      <CustomModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleModalOk, loading }}
      >
        <MembershipSettings onSubmit={handleFormSubmit} />
      </CustomModal>
    </div>
  );
};

export default memo(ActionButtons);
