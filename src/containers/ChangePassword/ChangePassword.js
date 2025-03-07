import React, { memo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Redirect } from 'react-router';
import LayoutWithLogo from '@/components/LayoutWithLogo';
import { getSuccess, getCurrentUser } from '@/redux/ducks/auth.duck';
import { PATHS } from '@/constants';

import ChangePasswordForm from './ChangePasswordForm';
import ChangePasswordSuccess from './ChangePasswordSuccess';
import styles from './changePassword.module.scss';

const ChangePassword = () => {
  const success = useSelector(getSuccess);
  const user = useSelector(getCurrentUser, shallowEqual);

  return user && !user.passwordChangeRequired ? (
    <Redirect to={PATHS.DASHBOARD} />
  ) : (
    <LayoutWithLogo>
      <div className={styles.container}>
        {!success ? <ChangePasswordForm /> : <ChangePasswordSuccess />}
      </div>
    </LayoutWithLogo>
  );
};

export default memo(ChangePassword);
