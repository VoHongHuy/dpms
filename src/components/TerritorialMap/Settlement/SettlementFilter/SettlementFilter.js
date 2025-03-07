import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Form';

import styles from './settlementFilter.module.scss';

const SettlementFilter = ({ onChange }) => {
  const intl = useIntl();
  const [filters, setFilters] = useState({});

  const handleInputChange = ({ target: { name, value } }) => {
    setFilters({ ...filters, [name]: value });
    onChange({ [name]: value });
  };

  return (
    <form className={styles.container}>
      <Input
        type="text"
        name="settlement"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'ORGANIZATION.SETTLEMENT.NAME' })}
        autoComplete="none"
        onChange={handleInputChange}
        value={filters.settlement}
      />
    </form>
  );
};

SettlementFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default memo(SettlementFilter);
