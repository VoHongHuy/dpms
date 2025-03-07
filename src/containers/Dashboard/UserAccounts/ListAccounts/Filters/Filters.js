import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { ROLES, STATUSES } from '@/constants/userAccounts';
import { Input, Select, Option } from '@/components/Form';
import Button from '@/components/Button';

import styles from './filters.module.scss';

const Filters = ({ onChange }) => {
  const [filters, setFilters] = useState({});
  const intl = useIntl();

  const handleReset = (e) => {
    e.preventDefault();
    setFilters({});
    onChange(undefined);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  return (
    <div className={styles.container}>
      <Input
        type="text"
        name="email"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.EMAIL' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.email}
      />
      <Input
        type="text"
        name="name"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.NAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.name}
      />
      <Input
        type="text"
        name="surname"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.SURNAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.surname}
      />
      <Select
        name="status"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.STATUS' })}
        onChange={handleInputChange}
        value={filters.status}
      >
        {Object.keys(STATUSES).map(key => (
          <Option key={`filters-status-${key}`} value={STATUSES[key].alias}>
            {intl.formatMessage({
              id: STATUSES[key].displayName,
            })}
          </Option>
        ))}
      </Select>
      <Select
        name="role"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.ROLE' })}
        onChange={handleInputChange}
        value={filters.role}
      >
        {Object.keys(ROLES).map(key => (
          <Option key={`filters-role-${key}`} value={ROLES[key].alias}>
            {intl.formatMessage({ id: ROLES[key].displayName })}
          </Option>
        ))}
      </Select>
      <Button className={styles.button} onClick={handleReset}>
        {intl.formatMessage({
          id: 'USER_ACCOUNT.LIST_ACCOUNTS.BUTTON.CLEAR_FILTERS',
        })}
      </Button>
    </div>
  );
};

Filters.propTypes = { onChange: PropTypes.func.isRequired };

export default memo(Filters);
