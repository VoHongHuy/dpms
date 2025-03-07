import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Input } from '@/components/Form';
import Button from '@/components/Button';

import styles from './resultNoteFilter.module.scss';

const ResultNoteFilter = ({ onChange }) => {
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
        name="author"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.FILTERS.AUTHOR' })}
        autoComplete="off"
        onChange={handleInputChange}
        value={filters.author}
      />
      <Input
        type="text"
        name="note"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.FILTERS.TEXT' })}
        autoComplete="off"
        onChange={handleInputChange}
        value={filters.note}
      />
      <Input
        type="text"
        name="unitName"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'RESULT.RESULT_DETAILS.TABS.NOTES.FILTERS.UNIT_NAME',
        })}
        autoComplete="off"
        onChange={handleInputChange}
        value={filters.unitName}
      />
      <Button
        onClick={clearFilters}
        className={styles.button}
      >
        {intl.formatMessage({
          id: 'RESULT.RESULT_DETAILS.TABS.NOTES.FILTERS.CLEAR',
        })}
      </Button>
    </form>
  );
};

ResultNoteFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default memo(ResultNoteFilter);
