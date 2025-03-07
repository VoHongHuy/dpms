/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getFormValues, isDirty, submit } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { stateToHTML } from 'draft-js-export-html';
import {
  getSelectedMembers,
  exportMembers,
  getIsExecuting,
  deSelectMembers,
  getSelectedMemberCount,
} from '@/redux/ducks/members.duck';
import CustomModal from '@/components/CustomModal';
import ConfirmModal from '@/components/ConfirmModal';
import { PERMISSIONS } from '@/constants/userAccounts';
import { hasPermissions } from '@/utils/user';
import { BULK_EMAIL_FORM } from '@/constants/forms';
import { getFetching, sendBulkMails } from '@/redux/ducks/bulkMails.duck';
import EmailSendingForm from '../../BulkEmails/EmailSendingForm';

import styles from './toolbox.module.scss';

const Toolbox = ({
  selectedMembers,
  deSelectMembers,
  exportMembers,
  isExecuting,
  selectedMemberCount,
}) => {
  const intl = useIntl();
  const fetching = useSelector(getFetching);
  const isFormDirty = useSelector(isDirty(BULK_EMAIL_FORM));
  const formValues = useSelector(getFormValues(BULK_EMAIL_FORM));
  const dispatch = useDispatch();

  const [state, setState] = useState({
    sendMailModal: false,
    saveModal: false,
    cancelModal: false,
  });

  const toggleModal = (modalName) => {
    setState(prevState => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
  };

  const handleFormSubmit = () => {
    toggleModal('saveModal');
  };

  const handleSaveModalOk = () => {
    const bulkMails = {
      ...formValues,
      content: stateToHTML(formValues.content.getCurrentContent()),
      memberIds: selectedMembers,
    };
    dispatch(
      sendBulkMails({
        bulkMails,
        callback: () => {
          toggleModal('saveModal');
          toggleModal('sendMailModal');
        },
      }),
    );
  };

  const handleCancelModalOk = () => {
    toggleModal('cancelModal');
    toggleModal('sendMailModal');
  };

  const handleSendMailModalOk = () => {
    dispatch(submit(BULK_EMAIL_FORM));
  };

  const handleSendMailCancel = () => {
    if (isFormDirty) {
      toggleModal('cancelModal');
    } else {
      toggleModal('sendMailModal');
    }
  };

  return (
    <>
      <ul className={styles.toolbox}>
        <li>
          ({selectedMemberCount} {intl.formatMessage({ id: 'MEMBERS.LIST_MEMBERS.TITLE' })})
        </li>
        {hasPermissions([PERMISSIONS.BULK_EMAIL.value]) && (
          <li>
            <a
              className={isExecuting ? styles.isDisabled : ''}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleModal('sendMailModal');
              }}
            >
              {intl.formatMessage({
                id: 'MEMBERS.LIST_MEMBERS.BUTTON.SEND_EMAIL',
              })}
            </a>
          </li>
        )}
        <li>
          <a
            className={isExecuting ? styles.isDisabled : ''}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isExecuting) {
                exportMembers(selectedMembers);
              }
            }}
          >
            {isExecuting ? intl.formatMessage({
              id: 'MEMBERS.LIST_MEMBERS.BUTTON.EXPORTING_MEMBERS',
            }) : intl.formatMessage({
              id: 'MEMBERS.LIST_MEMBERS.BUTTON.EXPORT_MEMBERS',
            })}
          </a>
        </li>
        <li>
          <a
            className={isExecuting ? styles.isDisabled : ''}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isExecuting) {
                deSelectMembers(...selectedMembers);
              }
            }}
          >
            {intl.formatMessage({
              id: 'MEMBERS.LIST_MEMBERS.BUTTON.CLEAR_SELECTED_MEMBERS',
            })}
          </a>
        </li>
      </ul>
      <CustomModal
        headerContent={(
          <FormattedHTMLMessage
            id="BULK_EMAIL.MODAL.HEADER.TITLE"
            values={{ number_of_selected_member: selectedMemberCount }}
          />
        )}
        toggle={() => toggleModal('sendMailModal')}
        open={state.sendMailModal}
        okButtonProps={{ onClick: handleSendMailModalOk }}
        cancelButtonProps={{ onClick: handleSendMailCancel }}
        buttonGroupProps={{ className: styles.buttonLeft }}
      >
        <EmailSendingForm onSubmit={handleFormSubmit} />
      </CustomModal>
      <ConfirmModal
        toggle={() => toggleModal('saveModal')}
        open={state.saveModal}
        okButtonProps={{ onClick: handleSaveModalOk, loading: fetching }}
      >
        <FormattedHTMLMessage
          id="BULK_EMAIL.MODAL.MESSAGE.CONFIRM"
          values={{ numSelectedMembers: selectedMemberCount }}
        />
      </ConfirmModal>
      <ConfirmModal
        toggle={() => toggleModal('cancelModal')}
        open={state.cancelModal}
        okButtonProps={{ onClick: handleCancelModalOk }}
      >
        <FormattedHTMLMessage
          id="BULK_EMAIL.MODAL.MESSAGE.CANCEL"
        />
      </ConfirmModal>
    </>
  );
};

Toolbox.defaultProps = {
  selectedMembers: [],
  selectedMemberCount: 0,
};

Toolbox.propTypes = {
  selectedMembers: PropTypes.arrayOf(PropTypes.string),
  deSelectMembers: PropTypes.func.isRequired,
  exportMembers: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool.isRequired,
  selectedMemberCount: PropTypes.number,
};

const mapStateToProps = state => ({
  selectedMembers: getSelectedMembers(state),
  isExecuting: getIsExecuting(state),
  selectedMemberCount: getSelectedMemberCount(state),
});

const mapDispatchToProps = dispatch => ({
  deSelectMembers: (...ids) => dispatch(deSelectMembers(ids)),
  exportMembers: (ids) => dispatch(exportMembers({ filters: { ids } })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);
