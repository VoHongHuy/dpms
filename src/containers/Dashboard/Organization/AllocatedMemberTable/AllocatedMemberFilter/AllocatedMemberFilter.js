import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Form';
import Button from '@/components/Button';

import styles from './allocatedMemberFilter.module.scss';

const AllocatedMemberFilter = ({ onChange }) => {
  const intl = useIntl();
  const [filters, setFilters] = useState({});

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  const clearFilters = (e) => {
    e.preventDefault();
    setFilters({});
    onChange(null);
  };

  return (
    <form className={styles.container}>
      <Input
        type="text"
        name="nameAndSurname"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'ORGANIZATION.TERRITORIAL.ALLOCATED_MEMBER.FILTER.NAME',
        })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.nameAndSurname}
      />
      <Input
        type="text"
        name="notes"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'ORGANIZATION.TERRITORIAL.ALLOCATED_MEMBER.FILTER.NOTE',
        })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.notes}
      />
      <Input
        type="text"
        name="subunitName"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'ORGANIZATION.TERRITORIAL.ALLOCATED_MEMBER.FILTER.SUBUNIT_NAME',
        })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.subunitName}
      />
      <Button
        onClick={clearFilters}
        className={styles.button}
      >
        {intl.formatMessage({
          id: 'ORGANIZATION.TERRITORIAL.ALLOCATED_MEMBER.FILTER.CLEAR_FILTERS',
        })}
      </Button>
    </form>
  );
};

AllocatedMemberFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default memo(AllocatedMemberFilter);
