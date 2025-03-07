import React, { memo, useState, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';
import { ENABLE_DUPLICATE_OIB_MODULE } from 'AppConfigs';
import history from '@/history';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import { getOidcUser } from '@/redux/ducks/oidc.duck';
import { ROLES, PERMISSIONS } from '@/constants/userAccounts';
import { userManager } from '@/providers/OidcProvider';
import { hasPermissions } from '@/utils/user';
import ConfirmModal from '@/components/ConfirmModal';

import { PATHS } from '../constants';

import Item from './Item';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const [expand, setActivity] = useState(false);
  const [activatedPath, setActivatedPath] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const intl = useIntl();
  const currentUser = useSelector(getCurrentUser, shallowEqual);
  const user = useSelector(getOidcUser);

  useEffect(() => {
    setActivatedPath(window.location.pathname);
  }, []);

  const toggleSidebar = () => {
    setActivity(!expand);
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleLogout = () => {
    userManager.removeUser();
    userManager.signoutRedirect({
      id_token_hint: user && user.id_token,
    });
  };

  const goToSection = path => {
    if (activatedPath.includes(path)) return;

    setActivatedPath(path);
    history.push(path);
  };

  const topItems = useMemo(
    () => [
      {
        icon: 'icon-home',
        pathname: PATHS.HOME,
        label: intl.formatMessage({ id: 'SIDEBAR.HOME' }),
        onClick: () => goToSection(PATHS.HOME),
      },
      ...(hasPermissions([PERMISSIONS.VIEW_RESULTS.value])
        ? [
          {
            icon: 'icon-chart',
            pathname: PATHS.RESULTS,
            label: intl.formatMessage({ id: 'SIDEBAR.RESULTS' }),
            onClick: () => goToSection(PATHS.RESULT_COUNTIES),
          },
        ]
        : []),
      ...(hasPermissions([PERMISSIONS.VIEW_MEMBERS.value])
        ? [
          {
            icon: 'icon-group-users',
            pathname: PATHS.MEMBERS,
            label: intl.formatMessage({ id: 'SIDEBAR.MEMBERS' }),
            onClick: () => goToSection(PATHS.MEMBERS),
          },
          ...(ENABLE_DUPLICATE_OIB_MODULE
            ? [{
              icon: 'fa fa-files-o',
              pathname: PATHS.DUPLICATE_OIBS,
              label: intl.formatMessage({ id: 'SIDEBAR.DUPLICATE_OIBS' }),
              onClick: () => goToSection(PATHS.DUPLICATE_OIBS),
            }]
            : []),
        ]
        : []),
      ...(hasPermissions([PERMISSIONS.VIEW_STRUCTURE.value])
        ? [
          {
            icon: 'icon-tree-structure',
            pathname: PATHS.STRUCTURE,
            label: intl.formatMessage({ id: 'SIDEBAR.STRUCTURE' }),
            onClick: () => goToSection(PATHS.STRUCTURE),
          },
        ]
        : []),
      ...(hasPermissions([PERMISSIONS.VIEW_TERRITORIAL_ORGANIZATION.value])
        ? [
          {
            icon: 'icon-map',
            pathname: PATHS.TERRITORIAL_ORGANIZATION,
            label: intl.formatMessage({ id: 'SIDEBAR.ORGANIZATION' }),
            onClick: () => goToSection(PATHS.TERRITORIAL_ORGANIZATION),
          },
        ]
        : []),
      ...(hasPermissions([PERMISSIONS.VIEW_PAYMENT.value])
        ? [
          {
            icon: 'fa fa-credit-card',
            pathname: PATHS.PAYMENTS,
            label: intl.formatMessage({ id: 'SIDEBAR.PAYMENTS' }),
            onClick: () => goToSection(PATHS.PAYMENTS),
          },
        ]
        : []),
      ...(hasPermissions([PERMISSIONS.BULK_EMAIL.value])
        ? [
          {
            icon: 'fa fa-envelope',
            pathname: PATHS.BULK_EMAILS,
            label: intl.formatMessage({ id: 'SIDEBAR.BULKEMAILS' }),
            onClick: () => goToSection(PATHS.BULK_EMAILS),
          },
        ]
        : []),
    ],
    [currentUser, activatedPath],
  );

  const bottomItems = useMemo(
    () => [
      ...(currentUser.role !== ROLES.USER.alias
        ? [
          {
            icon: 'icon-user-settings',
            pathname: PATHS.USER_ACCOUNTS,
            label: intl.formatMessage({ id: 'SIDEBAR.USER_ACCOUNT' }),
            onClick: () => goToSection(PATHS.USER_ACCOUNTS),
          },
        ]
        : []),
      {
        icon: 'icon-logout',
        label: intl.formatMessage({ id: 'SIDEBAR.LOGOUT' }),
        onClick: toggleModal,
      },
    ],
    [currentUser, activatedPath],
  );

  const renderItems = list =>
    list.map(item => (
      <Item
        {...item}
        key={`sidebar-${item.label}`}
        expand={expand}
        active={activatedPath.includes(item.pathname)}
      />
    ));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.topItems}>
          <Item
            label={(
              <>
                <h2 className={styles.userName}>{currentUser.name}</h2>
                <span className={styles.userEmail}>
                  {currentUser.preferred_username}
                </span>
              </>
            )}
            icon={!expand ? 'icon-chevrons-right' : 'icon-chevrons-left'}
            expand={expand}
            onClick={toggleSidebar}
            className={styles.itemToggleNavbar}
          />
          {renderItems(topItems)}
        </div>

        <div className={styles.bottomItems}>{renderItems(bottomItems)}</div>
      </div>
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleLogout }}
      >
        {intl.formatMessage({ id: 'SIDEBAR.LOGOUT.MODAL.DESCRIPTION' })}
      </ConfirmModal>
    </>
  );
};

export default memo(Sidebar);
