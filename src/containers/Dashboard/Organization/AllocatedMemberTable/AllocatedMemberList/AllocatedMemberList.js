import React, { memo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Pagination from '@/components/Pagination';
import AllocatedMemberItem from './AllocatedMemberItem';

import styles from './allocatedMemberList.module.scss';

const AllocatedMemberList = ({
  filters,
  allocatedMembers,
  fetchAllocatedMembers,
  pagination,
  onChangePagination,
  onUpdateNote,
  onDeletedAllocatedMember,
  linksGenerator,
  headingTitle,
  memberDisplayNameFormatter,
}) => {
  const intl = useIntl();
  const refreshMemberList = () => {
    fetchAllocatedMembers({ ...pagination, filters });
  };

  useEffect(() => {
    refreshMemberList();
  }, [filters, pagination]);

  const selectPageHandler = (pageIndex) => {
    onChangePagination(pageIndex);
  };

  const handleDeleteAllocatedMember = (member, callback) => {
    onDeletedAllocatedMember(member, () => {
      if (typeof callback === 'function') {
        callback();
      }
      refreshMemberList();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        {headingTitle}
      </div>
      <div className={styles.content}>
        {
          allocatedMembers.data.length === 0 ? (
            <div className={styles.message}>
              {intl.formatMessage({ id: 'ORGANIZATION.ALLOCATED_MEMBER.LIST.NO_MEMBER_MESSAGE' })}
            </div>
          ) : allocatedMembers.data.map(member =>
            (
              <AllocatedMemberItem
                key={member.allocationId}
                member={member}
                links={linksGenerator(member)}
                onDeletedAllocatedMember={handleDeleteAllocatedMember}
                onUpdateNote={onUpdateNote}
                memberDisplayFormatter={memberDisplayNameFormatter}
              />
            ))
        }
        <div className={styles.paginationContainer}>
          <Pagination
            pageIndex={pagination.page}
            pageSize={pagination.rowPerPage}
            totalRecords={allocatedMembers.total}
            onPageSelected={selectPageHandler}
          />
        </div>
      </div>
    </div>
  );
};

AllocatedMemberList.defaultProps = {
  filters: {},
  pagination: {},
  headingTitle: null,
  memberDisplayNameFormatter: null,
};

AllocatedMemberList.propTypes = {
  filters: PropTypes.object,
  allocatedMembers: PropTypes.object.isRequired,
  fetchAllocatedMembers: PropTypes.func.isRequired,
  pagination: PropTypes.object,
  onChangePagination: PropTypes.func.isRequired,
  onUpdateNote: PropTypes.func.isRequired,
  onDeletedAllocatedMember: PropTypes.func.isRequired,
  linksGenerator: PropTypes.func.isRequired,
  headingTitle: PropTypes.object,
  memberDisplayNameFormatter: PropTypes.func,
};

export default memo(AllocatedMemberList);
