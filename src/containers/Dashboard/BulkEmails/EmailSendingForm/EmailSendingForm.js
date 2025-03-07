import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { EditorState } from 'draft-js';
import { EMAIL_SENDER } from 'AppConfigs';
import { Input } from '@/components/Form';
import RichText from '@/components/Form/RichText';
import { BULK_EMAIL_FORM } from '@/constants/forms';
import validate from './validate';

import styles from './emailSendingForm.module.scss';

const EmailSendingForm = () => {
  const intl = useIntl();

  return (
    <form autoComplete="off" className={styles.container}>
      <Field
        component={Input}
        type="text"
        name="sender"
        placeholder={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.SENDER' })}
        className={styles.input}
        readOnly
      />
      <Field
        component={Input}
        type="text"
        name="subject"
        placeholder={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.SUBJECT' })}
        className={styles.input}
      />
      <Field
        component={RichText}
        type="text"
        name="content"
        placeholder={intl.formatMessage({ id: 'BULK_EMAIL.MODEL.CONTENT' })}
        className={styles.input}
      />
    </form>
  );
};

export default compose(
  connect(() => ({
    initialValues: {
      sender: EMAIL_SENDER,
      content: EditorState.createEmpty(),
    },
  })),
  reduxForm({
    form: BULK_EMAIL_FORM,
    validate,
    destroyOnUnmount: true,
  }),
)(EmailSendingForm);
