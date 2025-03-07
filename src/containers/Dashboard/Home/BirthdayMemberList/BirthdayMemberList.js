import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import lodash from 'lodash';
import { useIntl } from 'react-intl';
import { permissionsGuard } from '@/HOCs';
import { PATHS } from '@/containers/Dashboard/constants';
import { PERMISSIONS } from '@/constants/userAccounts';

import styles from './birthdayMemberList.module.scss';

const BirthdayMemberList = ({ members }) => {
  const intl = useIntl();
  const today = useMemo(() => {
    const date = new Date();
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  }, []);

  const normalizedMembers = useMemo(() => {
    const normalizedMembers = members.map(member => {
      const fullname = `${member.name} ${member.surname}`;
      const birthday = new Date(member.dateOfBirth);
      const year = birthday.getFullYear();
      const age = today.year - year;
      const location = [
        member.country,
        member.county,
        member.municipality,
      ].filter(l => !!l).join(' > ');

      return {
        id: member.id,
        age,
        name: fullname,
        contactNumber: member.contactNumber,
        location,
      };
    });
    const result = lodash.orderBy(normalizedMembers, ['age'], ['desc']);
    return result;
  }, [members]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {intl.formatMessage({ id: 'HOME.BIRTHDAY_MEMBER.HEADER' })}
      </div>
      <div className={styles.body}>
        {normalizedMembers.map(member => (
          <div key={member.id} className={styles.member}>
            <i className={`fa fa-birthday-cake ${styles.birthdayIcon}`} aria-hidden="true" />
            <span className={styles.age}>{member.age}</span>
            <Link to={PATHS.MEMBERS_EDIT.replace(':id', member.id)}>
              {member.name}
            </Link>
            {member.contactNumber && `, ${member.contactNumber}`}
            {member.location && `, ${member.location}`}
          </div>
        ))}
      </div>
    </div>
  );
};

BirthdayMemberList.propTypes = {
  members: PropTypes.array.isRequired,
};

export default memo(permissionsGuard(
  [PERMISSIONS.VIEW_MEMBERS.value],
  BirthdayMemberList,
  false,
));
