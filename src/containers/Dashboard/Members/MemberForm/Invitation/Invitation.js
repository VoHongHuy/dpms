import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field, getFormValues } from 'redux-form';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'AppConfigs';
import { FormSection, Input, TextArea } from '@/components/Form';
import { MEMBER_FORM } from '@/constants/forms';
import CheckBox from '@/components/CheckBox';
import { getCurrentUser } from '@/redux/ducks/auth.duck';

import styles from './invitation.module.scss';

const Invitation = ({ readOnly }) => {
  const intl = useIntl();
  const formValues = useSelector(getFormValues(MEMBER_FORM));
  const currentUser = useSelector(getCurrentUser);

  const renderCheckBoxLabel = () => {
    if (formValues && formValues.invited) {
      const text = intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.INVITATION.INVITED',
      });
      if (formValues.invitedBy && formValues.invitedTime) {
        return `${text} (${moment(formValues.invitedTime).format(
          DATE_TIME_FORMAT,
        )} ${formValues.invitedBy})`;
      }

      const invitedTime = formValues.invitedTime
        ? moment(formValues.invitedTime).format(DATE_TIME_FORMAT)
        : moment(Date.now()).format(DATE_TIME_FORMAT);

      return `${text} (${invitedTime} ${
        currentUser.name
      })`;
    }

    return intl.formatMessage({
      id: 'MEMBERS.DETAILS.SECTION.INVITATION.INVITE',
    });
  };

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.INVITATION.LABEL',
      })}
      className={styles.formSection}
    >
      <Field
        component={CheckBox}
        name="invited"
        label={renderCheckBoxLabel()}
        disabled={readOnly || (formValues && formValues.invited) || false}
        readOnly={readOnly}
      />
      <Field
        component={Input}
        type="text"
        name="role"
        className={styles.input}
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.INVITATION.MEMBER_ROLE',
        })}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <Field
        component={TextArea}
        name="workInPoliticalParty"
        className={styles.input}
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.INVITATION.WORK_IN_POLITICAL_PARTY',
        })}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <Field
        component={TextArea}
        name="volunteeringAndDonations"
        className={styles.input}
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.INVITATION.VOLUNTEERING_AND_DONATIONS',
        })}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <Field
        component={TextArea}
        name="estimate"
        className={styles.input}
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.INVITATION.ESTIMATE',
        })}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <Field
        component={TextArea}
        name="inviterComment"
        className={styles.input}
        label={intl.formatMessage({
          id: 'MEMBERS.DETAILS.SECTION.INVITATION.INVITER_COMMENT',
        })}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </FormSection>
  );
};

Invitation.defaultProps = { readOnly: false };
Invitation.propTypes = { readOnly: PropTypes.bool };

export default memo(Invitation);
