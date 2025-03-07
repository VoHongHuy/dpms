import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckBox from '@/components/CheckBox';

import styles from './permissionGroup.module.scss';

const PermissionGroup = ({
  className,
  label,
  viewProps,
  createProps,
  editProps,
  deleteProps,
  permissions,
  onChange,
  importProps,
  bulkEmailProps,
  isDisabled,
}) => {
  const intl = useIntl();
  const isCreateChecked = createProps && permissions.includes(createProps.value);
  const isEditChecked = permissions.includes(editProps.value);
  const isDeleteChecked = deleteProps && permissions.includes(deleteProps.value);
  const isImportChecked = importProps && permissions.includes(importProps.value);
  const isBulkEmailChecked = bulkEmailProps && permissions.includes(bulkEmailProps.value);

  const removeItemInArray = (array, item) => {
    const newArray = [...array];
    const index = newArray.indexOf(item);
    newArray.splice(index, 1);

    return newArray;
  };

  const handleViewActionChange = ({ target: { checked, value } }) => {
    if (isEditChecked) return;

    if (checked) {
      onChange([...new Set([...permissions, Number(value)])]);
    } else {
      const newPermissions = removeItemInArray(permissions, Number(value));
      onChange(newPermissions);
    }
  };

  const handleEditActionChange = ({ target: { checked, value } }) => {
    if (checked) {
      const newPermissions = new Set([...permissions, Number(value), viewProps.value]);
      if (importProps) {
        newPermissions.add(importProps.value);
      }
      if (bulkEmailProps) {
        newPermissions.add(bulkEmailProps.value);
      }

      onChange([...newPermissions]);
    } else {
      const newPermissions = removeItemInArray(permissions, Number(value));
      onChange(newPermissions);
    }
  };

  return (
    <div className={classNames(styles.container, className)}>
      <p className={styles.label}>{label}</p>
      <div className={styles.actions}>
        <CheckBox
          {...viewProps}
          className={classNames(styles.checkBox, viewProps.className)}
          label={intl.formatMessage({
            id: 'USER_ACCOUNT.PERMISSION.ACTION.VIEW',
          })}
          disabled={isCreateChecked
            || isEditChecked
            || isDeleteChecked
            || isImportChecked
            || isDisabled}
          checked={permissions.includes(viewProps.value)}
          onChange={handleViewActionChange}
        />
        {createProps && (
          <CheckBox
            {...createProps}
            checked={isCreateChecked}
            className={classNames(styles.checkBox, createProps.className)}
            label={intl.formatMessage({
              id: 'USER_ACCOUNT.PERMISSION.ACTION.CREATE',
            })}
            onChange={handleEditActionChange}
            disabled={isDisabled}
          />
        )}
        {importProps && (
          <CheckBox
            {...importProps}
            checked={isImportChecked}
            className={classNames(styles.checkBox, importProps.className)}
            label={intl.formatMessage({
              id: 'USER_ACCOUNT.PERMISSION.ACTION.IMPORT',
            })}
            onChange={handleEditActionChange}
            disabled={isEditChecked || isDisabled}
          />
        )}
        <CheckBox
          {...editProps}
          checked={isEditChecked}
          className={classNames(styles.checkBox, editProps.className)}
          label={intl.formatMessage({
            id: 'USER_ACCOUNT.PERMISSION.ACTION.EDIT',
          })}
          onChange={handleEditActionChange}
          disabled={isDisabled}
        />
        {deleteProps && (
          <CheckBox
            {...deleteProps}
            checked={isDeleteChecked}
            className={classNames(styles.checkBox, deleteProps.className)}
            label={intl.formatMessage({
              id: 'USER_ACCOUNT.PERMISSION.ACTION.DELETE',
            })}
            onChange={handleEditActionChange}
            disabled={isDisabled}
          />
        )}
        {bulkEmailProps && (
          <CheckBox
            {...bulkEmailProps}
            checked={isBulkEmailChecked}
            className={classNames(styles.checkBox, bulkEmailProps.className)}
            label={intl.formatMessage({
              id: 'USER_ACCOUNT.PERMISSION.ACTION.BULK_EMAIL',
            })}
            labelColor="red"
            onChange={handleEditActionChange}
            disabled={isDisabled || bulkEmailProps.disabled}
          />
        )}
      </div>
    </div>
  );
};

PermissionGroup.defaultProps = {
  className: '',
  permissions: [],
  createProps: null,
  deleteProps: null,
  importProps: null,
  bulkEmailProps: null,
  isDisabled: false,
};
PermissionGroup.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  viewProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  }).isRequired,
  createProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  }),
  editProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  }).isRequired,
  deleteProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  }),
  importProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  }),
  bulkEmailProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  permissions: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default memo(PermissionGroup);
