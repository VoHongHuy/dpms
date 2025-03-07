import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';
import { Input, FormSection } from '@/components/Form';

import styles from './basicInformation.module.scss';

const BasicInformation = () => {
  const intl = useIntl();

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'USER_ACCOUNT.ADD_ACCOUNT.SECTION.BASIC_INFORMATION.LABEL',
      })}
    >
      <Field
        component={Input}
        type="text"
        name="email"
        className={styles.Field}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.EMAIL' })}
      />
      <Field
        component={Input}
        type="text"
        name="name"
        className={styles.Field}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.NAME' })}
      />
      <Field
        component={Input}
        type="text"
        name="surname"
        className={styles.Field}
        placeholder={intl.formatMessage({ id: 'USER_ACCOUNT.MODEL.SURNAME' })}
      />
    </FormSection>
  );
};

export default memo(BasicInformation);
