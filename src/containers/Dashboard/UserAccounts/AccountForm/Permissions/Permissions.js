import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { PERMISSIONS, ROLES } from '@/constants/userAccounts';
import { getCurrentUser } from '@/redux/ducks/auth.duck';

import PermissionGroup from './PermissionGroup';
import PermissionActions from './PermissionActions';
import RegionBasePermission from '../../RegionBasePermisson';

const Permissions = ({ permissions, onChange, territorialRegions }) => {
  const intl = useIntl();
  const currentUser = useSelector(getCurrentUser);
  const groups = useMemo(
    () => [
      {
        key: 'results',
        label: intl.formatMessage({ id: 'USER_ACCOUNT.PERMISSION.RESULTS' }),
        viewProps: { ...PERMISSIONS.VIEW_RESULTS },
        editProps: { ...PERMISSIONS.MODIFY_RESULT },
      },
      {
        key: 'members',
        label: intl.formatMessage({ id: 'USER_ACCOUNT.PERMISSION.MEMBERS' }),
        viewProps: { ...PERMISSIONS.VIEW_MEMBERS },
        createProps: { ...PERMISSIONS.CREATE_MEMBER },
        editProps: { ...PERMISSIONS.UPDATE_MEMBER },
        deleteProps: { ...PERMISSIONS.DELETE_MEMBER },
        bulkEmailProps: {
          ...PERMISSIONS.BULK_EMAIL,
          disabled: currentUser.role !== ROLES.ADMIN.alias,
        },
      },
      {
        key: 'payments',
        label: intl.formatMessage({ id: 'USER_ACCOUNT.PERMISSION.PAYMENT' }),
        viewProps: { ...PERMISSIONS.VIEW_PAYMENT },
        editProps: { ...PERMISSIONS.UPDATE_PAYMENT },
        importProps: { ...PERMISSIONS.IMPORT_PAYMENT },
        isDisabled: currentUser.role !== ROLES.ADMIN.alias,
      },
      {
        key: 'structure',
        label: intl.formatMessage({ id: 'USER_ACCOUNT.PERMISSION.STRUCTURE' }),
        viewProps: { ...PERMISSIONS.VIEW_STRUCTURE },
        editProps: { ...PERMISSIONS.MODIFY_STRUCTURE },
      },
      {
        key: 'organization',
        label: intl.formatMessage({
          id: 'USER_ACCOUNT.PERMISSION.ORGANIZATION',
        }),
        viewProps: { ...PERMISSIONS.VIEW_TERRITORIAL_ORGANIZATION },
        editProps: { ...PERMISSIONS.MODIFY_TERRITORIAL_ORGANIZATION },
      },
    ],
    [],
  );

  const hasMemberPermissions = useMemo(() => {
    const memberPermissions = [
      PERMISSIONS.VIEW_MEMBERS.value,
      PERMISSIONS.CREATE_MEMBER.value,
      PERMISSIONS.UPDATE_MEMBER.value,
      PERMISSIONS.DELETE_MEMBER.value,
    ];
    return memberPermissions.some(permission => permissions.includes(permission));
  }, [permissions]);

  const isRegionBasePermissionVisible = memberGroup => hasMemberPermissions
    && (memberGroup.viewProps.value === PERMISSIONS.VIEW_MEMBERS.value
        || memberGroup?.createProps?.value === PERMISSIONS.CREATE_MEMBER.value
        || memberGroup.editProps.value === PERMISSIONS.UPDATE_MEMBER.value
        || memberGroup?.deleteProps?.value === PERMISSIONS.DELETE_MEMBER.value);

  const handleSelectAllViewPermissions = () => {
    const newPermissions = [...new Set([
      ...permissions,
      PERMISSIONS.VIEW_RESULTS.value,
      PERMISSIONS.VIEW_MEMBERS.value,
      PERMISSIONS.VIEW_STRUCTURE.value,
      PERMISSIONS.VIEW_TERRITORIAL_ORGANIZATION.value,
    ])];
    onChange(newPermissions);
  };

  const handleDeselectAllPermissions = () => {
    onChange([]);
  };

  const handlePermissionGroupChange = newPermissions => {
    onChange(newPermissions);
  };

  return (
    <>
      {groups.map(item => {
        const { key, ...group } = item;
        return (
          <div key={key}>
            <PermissionGroup
              {...group}
              permissions={permissions}
              onChange={handlePermissionGroupChange}
            />
            {
              isRegionBasePermissionVisible(group) && (
                <RegionBasePermission territorialRegions={territorialRegions} />
              )
            }
          </div>
        );
      })}
      <PermissionActions
        onSelectAllView={handleSelectAllViewPermissions}
        onDeselectAll={handleDeselectAllPermissions}
      />
    </>
  );
};

Permissions.defaultProps = { permissions: [], territorialRegions: [] };
Permissions.propTypes = {
  onChange: PropTypes.func.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.number),
  territorialRegions: PropTypes.arrayOf(PropTypes.string),
};

export default memo(Permissions);
