import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Input } from '@/components/Form';
import { MEMBERSHIP_SETTING_FORM } from '@/constants/forms';
import validate from './validate';

import styles from './membershipSettings.module.scss';

const MembershipSettings = () => {
  const intl = useIntl();

  return (
    <form autoComplete="off" className={styles.container}>
      <table className={styles.content}>
        <thead>
          <tr>
            <th>{ intl.formatMessage({ id: 'MEMBERS.MODEL.WORKING_STATUS' })}</th>
            <th>{ intl.formatMessage({ id: 'PAYMENTS.MODEL.AMOUNT' }) }</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.title}>
              {intl.formatMessage({ id: 'MEMBERS.MODEL.WORKING_STATUS.PUPIL' })}
            </td>
            <td>
              <Field
                component={Input}
                type="number"
                name="pupil"
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.title}>
              {intl.formatMessage({ id: 'MEMBERS.MODEL.WORKING_STATUS.STUDENT' })}
            </td>
            <td>
              <Field
                component={Input}
                type="number"
                name="student"
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.title}>
              {intl.formatMessage({ id: 'MEMBERS.MODEL.WORKING_STATUS.EMPLOYED' })}
            </td>
            <td>
              <Field
                component={Input}
                type="number"
                name="employed"
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.title}>
              {intl.formatMessage({ id: 'MEMBERS.MODEL.WORKING_STATUS.UNEMPLOYED' })}
            </td>
            <td>
              <Field
                component={Input}
                type="number"
                name="unemployed"
                className={styles.input}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.title}>
              {intl.formatMessage({ id: 'MEMBERS.MODEL.WORKING_STATUS.RETIRED' })}
            </td>
            <td>
              <Field
                component={Input}
                type="number"
                name="retired"
                className={styles.input}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default compose(
  connect((state) => ({
    initialValues: state.payments.settings,
  })),
  reduxForm({
    form: MEMBERSHIP_SETTING_FORM,
    validate,
    destroyOnUnmount: false,
  }),
)(MembershipSettings);
