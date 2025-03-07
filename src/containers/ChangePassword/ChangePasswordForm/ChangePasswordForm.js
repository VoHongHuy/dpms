import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Field, reduxForm, getFormValues } from 'redux-form';
import { getFetching, changePassword } from '@/redux/ducks/auth.duck';
import Button from '@/components/Button';
import { Input } from '@/components/Form';
import { CHANGE_PASSWORD_FORM } from '@/constants/forms';
import { getOidcUser } from '@/redux/ducks/oidc.duck';
import { userManager } from '@/providers/OidcProvider';
import { validations } from '@/utils';

import validate from './validate';
import styles from './changePasswordForm.module.scss';

const ChangePasswordForm = ({ handleSubmit, invalid }) => {
  const [satisfyRules, setSatisfyRules] = useState([]);
  const [errorState, setErrorState] = useState({
    showError: false,
    showSatisfyRules: false,
  });
  const loading = useSelector(getFetching);
  const intl = useIntl();
  const dispatch = useDispatch();
  const user = useSelector(getOidcUser);
  const formValues = useSelector(getFormValues(CHANGE_PASSWORD_FORM));
  const satisfyRuleKeys = useMemo(
    () => ({
      description: 'description',
      minLength: 'minLength',
      upperCharacter: 'upperCharacter',
      lowerCharacter: 'lowerCharacter',
      specialCharacter: 'specialCharacter',
      number: 'number',
    }),
    [],
  );
  const renderSatisfyPasswordRules = useMemo(
    () => ({
      [satisfyRuleKeys.description]: 'CHANGE_PASSWORD.ERROR.RULES.DESCRIPTION',
      [satisfyRuleKeys.minLength]: 'CHANGE_PASSWORD.ERROR.RULES.MIN_LENGTH',
      [satisfyRuleKeys.upperCharacter]:
        'CHANGE_PASSWORD.ERROR.RULES.AT_LEAST_ONE_UPPER_CHARACTER',
      [satisfyRuleKeys.lowerCharacter]:
        'CHANGE_PASSWORD.ERROR.RULES.AT_LEAST_ONE_LOWER_CHARACTER',
      [satisfyRuleKeys.specialCharacter]:
        'CHANGE_PASSWORD.ERROR.RULES.AT_LEAST_ONE_SPECIAL_CHARACTER',
      [satisfyRuleKeys.number]:
        'CHANGE_PASSWORD.ERROR.RULES.AT_LEAST_ONE_NUMBER',
    }),
    [],
  );

  useEffect(() => {
    let currentErrorState = { ...errorState };
    let currentSatisfyRules = [...satisfyRules];

    if (formValues) {
      const { newPassword, newPasswordConfirm } = formValues;

      if (newPassword && !validations.password(newPassword)) {
        currentErrorState = { showError: true, showSatisfyRules: true };
        currentSatisfyRules = [
          validations.minLength(newPassword) && satisfyRuleKeys.minLength,
          validations.containNumber(newPassword) && satisfyRuleKeys.number,
          validations.containUpperCharacter(newPassword) &&
            satisfyRuleKeys.upperCharacter,
          validations.containLowerCharacter(newPassword) &&
            satisfyRuleKeys.lowerCharacter,
          validations.containSpecialCharacter(newPassword) &&
            satisfyRuleKeys.specialCharacter,
        ];
      } else if (newPasswordConfirm) {
        currentErrorState = {
          showError: newPassword !== newPasswordConfirm,
          showSatisfyRules: false,
        };
        currentSatisfyRules = [];
      } else {
        currentErrorState = { showError: false, showSatisfyRules: false };
        currentSatisfyRules = [];
      }
    } else {
      currentErrorState = { showError: false, showSatisfyRules: false };
      currentSatisfyRules = [];
    }
    setErrorState({ ...currentErrorState });
    setSatisfyRules([...currentSatisfyRules]);
  }, [formValues]);

  const submit = values => dispatch(changePassword({ data: values }));

  const handleLogout = () => {
    userManager.removeUser();
    userManager.signoutRedirect({
      id_token_hint: user && user.id_token,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {intl.formatMessage({ id: 'CHANGE_PASSWORD.TITLE' })}
        </h1>
        <p className={styles.description}>
          {intl.formatMessage({ id: 'CHANGE_PASSWORD.DESCRIPTION' })}
        </p>
        <Form className={styles.form} onSubmit={handleSubmit(submit)}>
          <Field
            component={Input}
            type="password"
            name="currentPassword"
            placeholder={intl.formatMessage({
              id: 'CHANGE_PASSWORD.FIELD.CURRENT_PASSWORD',
            })}
            autoFocus
            required
            meta={undefined}
            autoComplete="none"
          />
          <Field
            component={Input}
            type="password"
            name="newPassword"
            placeholder={intl.formatMessage({
              id: 'CHANGE_PASSWORD.FIELD.PASSWORD',
            })}
            required
            meta={undefined}
            autoComplete="none"
          />
          <Field
            component={Input}
            type="password"
            name="newPasswordConfirm"
            placeholder={intl.formatMessage({
              id: 'CHANGE_PASSWORD.FIELD.PASSWORD_CONFIRM',
            })}
            required
            meta={undefined}
            autoComplete="none"
          />
          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              className={styles.button}
              loading={loading}
              disabled={invalid}
            >
              {intl.formatMessage({
                id: 'CHANGE_PASSWORD.BUTTON.SET_PASSWORD',
              })}
            </Button>
            <Button className={styles.button} onClick={handleLogout}>
              {intl.formatMessage({
                id: 'CHANGE_PASSWORD.BUTTON.CANCEL',
              })}
            </Button>
          </div>
          {errorState.showError && (
            <div className={styles.errors}>
              <p className={styles.errorTitle}>
                {intl.formatHTMLMessage({
                  id: 'CHANGE_PASSWORD.ERROR.PASSWORD_NOT_MATCH',
                })}
              </p>
              {errorState.showSatisfyRules ? (
                <div className={styles.errorRules}>
                  {Object.keys(renderSatisfyPasswordRules).map(key => (
                    <p
                      key={`password-rule-${key}`}
                      className={classNames(
                        styles.rule,
                        satisfyRules.includes(key) && styles.satisfy,
                      )}
                    >
                      {intl.formatMessage({
                        id: renderSatisfyPasswordRules[key],
                      })}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: CHANGE_PASSWORD_FORM,
  validate,
  touchOnChange: true,
  destroyOnUnmount: true,
})(ChangePasswordForm);
