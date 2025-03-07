import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormSection, Input, Select, Option } from '@/components/Form';
import { WORKING_STATUSES } from '@/constants/member';

import styles from './education.module.scss';

const Education = ({ readOnly }) => {
  const intl = useIntl();

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.EDUCATION.LABEL',
      })}
      className={styles.formSection}
    >
      <div className={styles.content}>
        <Field
          component={Input}
          type="text"
          name="qualification"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.QUALIFICATION' })}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="vocation"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.VOCATION' })}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="profession"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.PROFESSION' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Input}
          type="text"
          name="schoolName"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.SCHOOL_NAME' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
        <Field
          component={Select}
          name="workingStatus"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.WORKING_STATUS' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        >
          <Option value="" hidden />
          {Object.keys(WORKING_STATUSES).map(key => (
            <Option
              key={`education-working-status-${key}`}
              value={WORKING_STATUSES[key].alias}
            >
              {intl.formatMessage({
                id: WORKING_STATUSES[key].displayName,
              })}
            </Option>
          ))}
        </Field>
        <Field
          component={Input}
          type="text"
          name="maritalStatus"
          className={styles.input}
          label={intl.formatMessage({ id: 'MEMBERS.MODEL.MARITAL_STATUS' })}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
      </div>
    </FormSection>
  );
};

Education.defaultProps = { data: {}, readOnly: false };
Education.propTypes = {
  data: PropTypes.shape({
    qualification: PropTypes.string,
    vocation: PropTypes.string,
    profession: PropTypes.string,
    schoolName: PropTypes.string,
    workingStatus: PropTypes.string,
    martialStatus: PropTypes.string,
  }),
  readOnly: PropTypes.bool,
};

export default memo(Education);
