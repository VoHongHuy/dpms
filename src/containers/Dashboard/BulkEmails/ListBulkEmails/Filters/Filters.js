import React, { useMemo } from 'react';
import { compose } from 'redux';
import { reduxForm, Field } from 'redux-form';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { debounce } from 'lodash';
import { fetchProviders, getProviders } from '@/redux/ducks/members.duck';
import { Input, DatePicker } from '@/components/Form';
import Button from '@/components/Button';
import MultiSelect from '@/components/Form/MultiSelect';
import { BULK_EMAIL_FILTER_FORM } from '@/constants/forms';

import styles from './filters.module.scss';

const Filters = ({ reset }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const providers = useSelector(getProviders);

  const memberOptions = useMemo(() => providers.map(m => ({
    label: `${m.name} ${m.surname}`,
    value: m.id,
  })), [providers]);

  const handleReset = e => {
    e.preventDefault();
    reset({});
  };

  const handleBlur = event => event.preventDefault();

  const handleInputChange = debounce(value => {
    dispatch(fetchProviders({ name: value }));
  }, 500);

  return (
    <form className={styles.container}>
      <Field
        component={Input}
        type="text"
        name="subject"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.SUBJECT' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="sender"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.SENDER' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="content"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.CONTENT' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={Input}
        type="text"
        name="sendBy"
        className={styles.input}
        placeholder={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.USER' })}
        autoComplete="none"
        onBlur={handleBlur}
      />
      <Field
        component={DatePicker}
        type="text"
        name="dateFrom"
        className={styles.input}
        placeholderText={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.DATE_FROM' })}
        onBlur={handleBlur}
      />
      <Field
        component={DatePicker}
        type="text"
        name="dateTo"
        className={styles.input}
        placeholderText={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.DATE_TO' })}
        onBlur={handleBlur}
      />
      <Field
        component={MultiSelect}
        name="members"
        className={styles.input}
        placeholder={intl.formatMessage({
          id: 'BULK_EMAIL.MODEL.MEMBERS',
        })}
        options={memberOptions}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
      />
      <Button className={styles.button} onClick={handleReset}>
        {intl.formatMessage({
          id: 'BULK_EMAIL.BUTTON.CLEAR_FILTERS',
        })}
      </Button>
    </form>
  );
};

Filters.propTypes = {
  reset: PropTypes.func.isRequired,
};

export default compose(
  connect(() => ({
    initialValues: {},
  })),
  reduxForm({
    form: BULK_EMAIL_FILTER_FORM,
    touchOnChange: true,
  }),
)(Filters);
