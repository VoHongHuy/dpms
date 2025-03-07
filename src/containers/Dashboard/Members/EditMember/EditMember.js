import React, { memo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { submit, isDirty, initialize } from 'redux-form';
import { useParams } from 'react-router';
import history from '@/history';
import Loading from '@/components/Loading';
import SectionHeader from '@/components/SectionHeader';
import { MEMBER_FORM } from '@/constants/forms';
import { PERMISSIONS } from '@/constants/userAccounts';
import {
  updateMember,
  fetchMember,
  getMemberSelected,
  clearMemberSelected,
} from '@/redux/ducks/members.duck';
import { user } from '@/utils';
import ConfirmModal from '@/components/ConfirmModal';
import { getCountries, fetchCountries } from '@/redux/ducks/countries.duck';

import MemberForm from '../MemberForm';

import styles from './editMember.module.scss';

const EditMember = () => {
  const [isFetching, setFetchStatus] = useState(true);
  const [isUpdating, setUpdateStatus] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams();
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentCountriesData = useSelector(getCountries);
  const data = useSelector(getMemberSelected, shallowEqual);
  const isFormDirty = useSelector(isDirty(MEMBER_FORM));
  const hasModifyPermission = user.hasPermissions([
    PERMISSIONS.UPDATE_MEMBER.value,
  ]);

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    dispatch(
      fetchMember({
        id,
        callback: () => setFetchStatus(false),
      }),
    );

    return () => {
      dispatch(clearMemberSelected());
    };
  }, []);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleBackButtonClick = () => {
    if (isFormDirty) {
      toggleModal();
    } else {
      history.goBack();
    }
  };

  const handleSubmitButtonClick = e => {
    e.preventDefault();
    dispatch(submit(MEMBER_FORM));
  };

  const handleFormSubmit = formValues => {
    setUpdateStatus(true);
    dispatch(
      updateMember({
        data: {
          ...formValues,
          cardProvidedByMemberId: formValues.cardProvidedByMember?.value,
        },
        callback: () => {
          setUpdateStatus(false);
          dispatch(initialize(MEMBER_FORM, formValues, false));
        },
      }),
    );
  };

  const handleModalOk = () => {
    history.goBack();
  };

  const renderHeaderContent = () => {
    if (isFetching || !data) {
      return intl.formatMessage({ id: 'MEMBERS.EDIT_MEMBER.TITLE' });
    }

    return data.name;
  };

  const renderHeaderActions = () => ({
    closeButtonProps: {
      children: intl.formatMessage({
        id: 'MEMBERS.EDIT_MEMBER.ACTIONS.CLOSE',
      }),
      onClick: handleBackButtonClick,
    },
    ...(hasModifyPermission
      ? {
        submitButtonProps: {
          children: intl.formatMessage({
            id: 'MEMBERS.EDIT_MEMBER.ACTIONS.SUBMIT',
          }),
          onClick: handleSubmitButtonClick,
          disabled: isUpdating || !isFormDirty,
        },
      }
      : {}),
  });

  return (
    <>
      <div className={styles.container}>
        <SectionHeader
          title={renderHeaderContent()}
          actions={renderHeaderActions()}
        />
        {isFetching || !data || currentCountriesData.length === 0 ? (
          <Loading />
        ) : (
          <div className={styles.content}>
            <MemberForm
              data={data}
              onSubmit={handleFormSubmit}
              hasModifyPermission={hasModifyPermission}
            />
          </div>
        )}
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

export default memo(EditMember);
