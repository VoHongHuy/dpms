import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Form';
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
        name="name"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.NAME',
        })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.name}
      />
      <Input
        type="text"
        name="addedBy"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.ADDED_BY',
        })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.addedBy}
      />
      <Button className={styles.button} onClick={handleReset}>
        {intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.CLEAR_FILTERS',
        })}
      </Button>
    </div>
  );
};

Filters.propTypes = { onChange: PropTypes.func.isRequired };

export default memo(Filters);
