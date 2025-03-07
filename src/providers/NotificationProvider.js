import React, { useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { useIntl } from 'react-intl';
import { NOTIFICATION_DURATION } from 'AppConfigs';
import { getNotification } from '@/redux/ducks/notification.duck';

const toastProps = {
  autoDismiss: true,
  autoDismissTimeout: NOTIFICATION_DURATION,
  placement: 'top-right',
};

const Notification = ({ children }) => {
  const { addToast } = useToasts();
  const intl = useIntl();
  const notification = useSelector(getNotification, shallowEqual);

  useEffect(() => {
    const { id, type: appearance, message } = notification;
    if (!id) return;

    addToast(intl.formatMessage({ id: message }), { appearance });
  }, [notification]);

  return children;
};

export default (props) => (
  <ToastProvider {...toastProps}>
    <Notification {...props} />
  </ToastProvider>
);
