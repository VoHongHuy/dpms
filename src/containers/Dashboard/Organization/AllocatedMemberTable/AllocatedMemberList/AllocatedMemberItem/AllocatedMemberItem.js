/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { PATHS } from '@/containers/Dashboard/constants';
import Breadcrumb from '@/components/Breadcrumb';
import ConfirmModal from '@/components/ConfirmModal';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import NoteForm from './NoteForm';

import styles from './allocatedMemberItem.module.scss';

const AllocatedMemberItem = ({
  member,
  links,
  onDeletedAllocatedMember,
  onUpdateNote,
  memberDisplayFormatter,
}) => {
  const intl = useIntl();
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const onDeleteMemberAllocated = e => {
    e.preventDefault();
    toggleModal();
  };

  const handleModalOk = () => {
    onDeletedAllocatedMember(member, toggleModal);
  };

  const handleUpdateNote = (notes, callback) => {
    onUpdateNote(member, notes, callback);
  };

  return (
    <div className={styles.item}>
      <div className={styles.breadcrumb}>
        <strong>{member.name} {member.surname}</strong> {' '}
        (<Breadcrumb links={links} />)
      </div>
      <div className={styles.info}>
        {member.email} {member.contactNumber} {member.address && ` | ${member.address}`} {' '}
        ({intl.formatMessage({
          id: 'ORGANIZATION.ELECTION_UNIT',
        }, {
          electionUnit: memberDisplayFormatter
            ? memberDisplayFormatter(member)
            : member.electionUnit,
        })})
      </div>
      <div className={styles.controls}>
        <div className={styles.noteContainer}>
          <NoteForm
            notes={member.allocationNotes}
            onUpdate={handleUpdateNote}
          />
        </div>
        <ul className={styles.control}>
          {hasPermissions([PERMISSIONS.VIEW_MEMBERS.value]) && (
            <li>
              <a
                href={`${PATHS.MEMBERS_EDIT.replace(':id', member.id)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {intl.formatMessage({
                  id: 'ORGANIZATION.ALLOCATED_MEMBER.LIST.MEMBER_DETAILS',
                })}
              </a>
            </li>
          )}
          {hasPermissions([PERMISSIONS.MODIFY_TERRITORIAL_ORGANIZATION.value]) && (
            <li>
              <a href="#" className={styles.removeControl} onClick={onDeleteMemberAllocated}>
                {intl.formatMessage({
                  id: 'ORGANIZATION.ALLOCATED_MEMBER.LIST.REMOVE_MEMBER',
                })}
              </a>
            </li>
          )}
        </ul>
      </div>
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleModalOk }}
      >
        {intl.formatMessage({
          id: 'ORGANIZATION.ALLOCATED_MEMBER.LIST.REMOVE_MEMBER_MESSAGE',
        }, {
          name: member.name,
          surname: member.surname,
          allocated_unit_name: links[links.length - 1].name,
        })}
      </ConfirmModal>
    </div>
  );
};

AllocatedMemberItem.defaultProps = {
  memberDisplayFormatter: null,
};

AllocatedMemberItem.propTypes = {
  member: PropTypes.object.isRequired,
  onDeletedAllocatedMember: PropTypes.func.isRequired,
  onUpdateNote: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  memberDisplayFormatter: PropTypes.func,
};

export default memo(AllocatedMemberItem);
