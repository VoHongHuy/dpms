/* eslint-disable max-len */
import React, { memo, useState } from 'react';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { DATE_TIME_FORMAT } from 'AppConfigs';
import { deleteMember } from '@/redux/ducks/members.duck';
import { FormSection } from '@/components/Form';
import Button from '@/components/Button';
import ConfirmModal from '@/components/ConfirmModal';
import { PERMISSIONS } from '@/constants/userAccounts';
import { permissionsGuard } from '@/HOCs';
import AllocatedLink from '../../AllocatedLinks';

import styles from './systemInformation.module.scss';

const SystemInformation = ({ data, hidden, readOnly }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setDeleteStatus] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();

  const toggleModal = e => {
    e.preventDefault();
    setOpenModal(!openModal);
  };

  const handleDelete = () => {
    setDeleteStatus(true);
    dispatch(
      deleteMember({
        id: data.id,
        callback: () => {
          setDeleteStatus(false);
        },
      }),
    );
  };

  const DeleteMemberButton = permissionsGuard(
    [PERMISSIONS.DELETE_MEMBER.value],
    () => (
      <Button
        color="default"
        className={styles.button}
        onClick={toggleModal}
      >
        {intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.SYSTEM_INFORMATION.DELETE_MEMBER',
        })}
      </Button>
    ),
    false,
  );

  return !hidden ? (
    <>
      <FormSection
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.SYSTEM_INFORMATION.LABEL',
        })}
      >
        <p className={styles.text}>
          {intl.formatMessage({
            id: 'MEMBERS.DETAILS.SECTION.SYSTEM_INFORMATION.MEMBER_ADDED',
          })}
          :&nbsp;
          <b>{moment(data.createdTime).format(DATE_TIME_FORMAT)}</b>
        </p>
        <p className={styles.text}>
          {intl.formatMessage({
            id: 'MEMBERS.DETAILS.SECTION.SYSTEM_INFORMATION.IMPORT_EXTERNAL',
          })}
          :&nbsp;
          <b>
            {intl.formatMessage({
              id: data.externalSystemId
                ? 'MEMBERS.DETAILS.SECTION.SYSTEM_INFORMATION.IMPORT_EXTERNAL.YES'
                : 'MEMBERS.DETAILS.SECTION.SYSTEM_INFORMATION.IMPORT_EXTERNAL.NO',
            })}
          </b>
        </p>
        <div className={styles.allocated}>
          <span className={styles.text}>
            {intl.formatMessage({ id: 'MEMBERS.DETAILS.SECTION.SYSTEM_INFORMATION.ALLOCATED' })}:
          </span> <AllocatedLink data={data} />
        </div>
        {!readOnly ? <DeleteMemberButton /> : null}
      </FormSection>
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleDelete, loading: isDeleting }}
      >
        <FormattedHTMLMessage
          id="MEMBERS.EDIT_MEMBER.DELETE.WARNING.TEXT"
          values={{ name: data.name }}
        />
      </ConfirmModal>
    </>
  ) : null;
};

SystemInformation.defaultProps = { data: {}, hidden: false, readOnly: false };
SystemInformation.propTypes = {
  data: PropTypes.object,
  hidden: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default memo(SystemInformation);
