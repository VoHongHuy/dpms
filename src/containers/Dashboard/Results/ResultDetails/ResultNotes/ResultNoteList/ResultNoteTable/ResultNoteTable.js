/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import { permissionsGuard } from '@/HOCs';
import { PERMISSIONS } from '@/constants/userAccounts';

import styles from './resultNoteTable.module.scss';

const ResultNoteTable = ({ data, onDeleteNote, onEditNote }) => {
  const intl = useIntl();
  const currentUser = useSelector(getCurrentUser);
  const getRegion = (item) => {
    const region = [
      CROATIA_COUNTRY_NAME,
      item.electionUnitNumber ? `Election unit: ${item.electionUnitNumber}` : undefined,
      item.county,
      item.municipality,
      item.settlement,
    ].filter(m => m).join('/');
    return region;
  };

  const handleDeleteNote = (event, item) => {
    event.preventDefault();
    onDeleteNote(item);
  };

  const handleEditNote = (event, item) => {
    event.preventDefault();
    onEditNote(item);
  };

  const EditNoteButton = permissionsGuard(
    [PERMISSIONS.MODIFY_RESULT.value],
    ({ item }) => (
      <a
        className={styles.editControl}
        href="#"
        onClick={event => handleEditNote(event, item)}
      >
        {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.LIST.ACTIONS.EDIT' })}
      </a>
    ),
    false,
  );

  const DeleteNoteButton = permissionsGuard(
    [PERMISSIONS.MODIFY_RESULT.value],
    ({ item }) => (
      <a
        className={styles.deleteControl}
        href="#"
        onClick={event => handleDeleteNote(event, item)}
      >
        {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.LIST.ACTIONS.DELETE' })}
      </a>
    ),
    false,
  );

  return (
    <div className={styles.container}>
      {data.length > 0 ? (
        data.map(item => (
          <div key={item.id} className={styles.item}>
            <div className={styles.content}>
              <div className={styles.header}>
                <span>{item.author}</span> &nbsp;
                <Moment format="DD.MM.YYYY. HH:mm">
                  { item.updatedTime }
                </Moment> &nbsp;|&nbsp;
                <span>{getRegion(item)}</span>
              </div>
              <div className={styles.body}>
                {item.note}
              </div>
            </div>
            <div className={styles.controls}>
              {currentUser.sub === item.createdByUserId && <EditNoteButton item={item} />} <br />
              {currentUser.sub === item.createdByUserId && <DeleteNoteButton item={item} />}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.center}>{intl.formatMessage({ id: 'TABLE.EMPTY.TEXT' })}</div>
      )}
    </div>
  );
};

ResultNoteTable.defaultProps = {
  data: [],
};

ResultNoteTable.propTypes = {
  data: PropTypes.array,
  onDeleteNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired,
};

export default memo(ResultNoteTable);
