/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PATHS } from '@/containers/Dashboard/constants';
import { exportMembers } from '@/redux/ducks/members.duck';
import styles from './mailStatusList.module.scss';

const MailStatusList = ({ data, status }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const exportToExcel = (e) => {
    e.preventDefault();
    dispatch(exportMembers({
      filters: {
        ids: data.items.map(x => x.memberId),
      },
      fileName: `Members_${status}`,
    }));
  };

  return (
    <div className={styles.mail_status_list_container}>
      <div className={styles.mail_status_total}>
        <strong>
          {intl.formatMessage({ id: 'BULK_EMAIL.MAIL_ACTIVITY.TOTAL' })}:
        </strong>&nbsp;{data.total}
      </div>
      {
        (data && data.items.length > 0) &&
        (
          <>
            <div className={styles.mail_status_export}>
              <a href="#" onClick={exportToExcel}>
                {intl.formatMessage({ id: 'BULK_EMAIL.MAIL_ACTIVITY.EXPORT_MEMBERS' })}
              </a>
            </div>
            <div className={styles.mail_status_list}>
              <ul>
                {
                  data.items.map(item => (
                    <li key={item.memberId}>
                      <Link to={PATHS.MEMBERS_EDIT.replace(':id', item.memberId)}>
                        {item.name}&nbsp;{item.surname}&nbsp;({item.email})
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>
          </>
        )
      }
    </div>
  );
};

MailStatusList.propTypes = {
  data: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default memo(MailStatusList);
