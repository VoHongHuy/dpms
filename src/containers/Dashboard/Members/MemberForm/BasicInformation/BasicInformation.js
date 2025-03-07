import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  FormSection,
  Input,
  DatePicker,
  Select,
  Option,
} from '@/components/Form';
import CheckBox from '@/components/CheckBox';
import { rolesGuard } from '@/HOCs';
import { SEX } from '@/constants/member';
import { ROLES } from '@/constants/userAccounts';

import styles from './basicInformation.module.scss';

const BasicInformation = ({ readOnly }) => {
  const intl = useIntl();

  const IsPrivateField = rolesGuard([ROLES.ADMIN.alias], () => (
    <Field
      component={CheckBox}
      name="isPrivate"
      label={intl.formatMessage({ id: 'MEMBERS.MODEL.PRIVATE_MEMBER' })}
      readOnly={readOnly}
      disabled={readOnly}
    />
  ), false);

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.BASIC_INFORMATION.LABEL',
      })}
      className={styles.formSection}
    >
      <div className={styles.header}>
        <IsPrivateField />
      </div>
      <div className={styles.content}>
        <Field
          component={Input}
          type="text"
          name="name"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.NAME' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="surname"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.SURNAME' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="number"
          name="ssn"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.SSN' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={DatePicker}
          type="text"
          name="dateOfBirth"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.DOB' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="placeOfBirth"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.PLACE_OF_BIRTH' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="nationality"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.NATIONALITY' })}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Select}
          type="text"
          name="sex"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.SEX' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        >
          <Option value="" hidden />
          <Option value={SEX.MALE.alias}>
            {intl.formatMessage({ id: SEX.MALE.displayName })}
          </Option>
          <Option value={SEX.FEMALE.alias}>
            {intl.formatMessage({ id: SEX.FEMALE.displayName })}
          </Option>
        </Field>
      </div>
    </FormSection>
  );
};

BasicInformation.defaultProps = { readOnly: false };
BasicInformation.propTypes = { readOnly: PropTypes.bool };

export default memo(BasicInformation);
