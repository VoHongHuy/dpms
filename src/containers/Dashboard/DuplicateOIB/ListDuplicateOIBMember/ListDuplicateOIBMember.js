import React, { memo, useEffect } from 'react';
import MembersTable from '@/components/MembersTable';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  getFetching,
  fetchDuplicateOibMembers,
  getDuplicateOibMembers,
} from '@/redux/ducks/duplicate-oibs.duck';

import styles from './listDuplicateOIBMember.module.scss';

const ListDuplicateOIBMember = () => {
  const data = useSelector(getDuplicateOibMembers, shallowEqual);

  const loading = useSelector(getFetching);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDuplicateOibMembers());
  }, []);

  return (
    <div className={styles.container}>
      <MembersTable
        openDetailsInNewTab
        data={data}
        progressPending={loading}
      />
    </div>
  );
};

export default memo(ListDuplicateOIBMember);
