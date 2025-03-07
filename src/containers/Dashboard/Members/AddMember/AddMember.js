import React, { memo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { submit, isDirty } from 'redux-form';
import PATHS from '@/containers/Dashboard/constants/paths';
import history from '@/history';
import SectionHeader from '@/components/SectionHeader';
import { MEMBER_FORM } from '@/constants/forms';
import { PERMISSIONS } from '@/constants/userAccounts';
import { addMember } from '@/redux/ducks/members.duck';
import { user } from '@/utils';
import ConfirmModal from '@/components/ConfirmModal';
import { getCountries, fetchCountries } from '@/redux/ducks/countries.duck';
import Loading from '@/components/Loading';

import MemberForm from '../MemberForm';

import styles from './addMember.module.scss';

const AddMember = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isAdding, setAddStatus] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentCountriesData = useSelector(getCountries);

  const isFormDirty = useSelector(isDirty(MEMBER_FORM));
  const hasModifyPermission = user.hasPermissions([
    PERMISSIONS.CREATE_MEMBER.value,
  ]);

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleBackButtonClick = () => {
    if (isFormDirty) {
      toggleModal();
    } else {
      history.push(PATHS.MEMBERS);
    }
  };

  const handleSubmitButtonClick = e => {
    e.preventDefault();
    dispatch(submit(MEMBER_FORM));
  };

  const handleFormSubmit = formValues => {
    setAddStatus(true);
    dispatch(
      addMember({
        data: {
          ...formValues,
          cardProvidedByMemberId: formValues.cardProvidedByMember?.value,
        },
        callback: () => setAddStatus(false) },
      ),
    );
  };

  const handleModalOk = () => {
    history.push(PATHS.MEMBERS);
  };

  return (
    <>
      <div className={styles.container}>
        <SectionHeader
          title={intl.formatMessage({ id: 'MEMBERS.ADD_MEMBER.TITLE' })}
          actions={{
            closeButtonProps: {
              children: intl.formatMessage({
                id: 'MEMBERS.ADD_MEMBER.ACTIONS.CLOSE',
              }),
              onClick: handleBackButtonClick,
            },
            submitButtonProps: {
              children: intl.formatMessage({
                id: 'MEMBERS.ADD_MEMBER.ACTIONS.SUBMIT',
              }),
              onClick: handleSubmitButtonClick,
              disabled: isAdding || !isFormDirty,
            },
          }}
        />
        {
          currentCountriesData.length === 0 ? <Loading /> : (
            <div className={styles.content}>
              <MemberForm
                onSubmit={handleFormSubmit}
                documentsProps={{ hideDownloadAction: true }}
                systemInfomationProps={{ hidden: true }}
                hasModifyPermission={hasModifyPermission}
              />
            </div>
          )
        }
      </div>
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleModalOk }}
      >
        {intl.formatMessage({
          id: 'FORM.CONFIRM_MODAL_UNSAVED.DESCRIPTION',
        })}
      </ConfirmModal>
    </>
  );
};

export default memo(AddMember);
