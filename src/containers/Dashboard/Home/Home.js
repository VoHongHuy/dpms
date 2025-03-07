import React, { memo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import SectionHeader from '@/components/SectionHeader';
import { getBirthdayMembers, fetchBirthdayMembers } from '@/redux/ducks/members.duck';
import { hasPermissions } from '@/utils/user';
import { PERMISSIONS } from '@/constants/userAccounts';
import BirthdayMemberList from './BirthdayMemberList';

import styles from './home.module.scss';

const Home = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const birthdayMembers = useSelector(getBirthdayMembers);

  useEffect(() => {
    if (hasPermissions([PERMISSIONS.VIEW_MEMBERS.value])) {
      dispatch(fetchBirthdayMembers());
    }
  }, []);

  return (
    <>
      <SectionHeader title={intl.formatMessage({ id: 'HOME.TITLE' })} />
      <div className={styles.welcome}>
        <h1 className={styles.title}>
          {intl.formatMessage({ id: 'HOME.CONTENT.TITLE' })}
        </h1>
        <p className={styles.description}>
          {intl.formatMessage({ id: 'HOME.CONTENT.DESCRIPTION' })}
        </p>
        {
          birthdayMembers.length > 0 && (
            <BirthdayMemberList members={birthdayMembers} />
          )
        }
      </div>
    </>
  );
};

export default memo(Home);
