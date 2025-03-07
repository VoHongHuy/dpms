import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { downloadDocument } from '@/redux/ducks/members.duck';

import IconColumn from '../IconColumn';

import styles from './documentColumn.module.scss';

const DocumentColumn = ({ data }) => {
  const dispatch = useDispatch();

  const handleDownloadDocument = document => {
    dispatch(downloadDocument({ memberId: data.id, documentId: document.id }));
  };

  return data.documents && data.documents.length > 0 ? (
    <IconColumn className={styles.iconColumnWrapper}>
      <div className={styles.tooltip}>
        {data.documents.map((doc, index) => (
          <p key={doc.id} className={styles.documentGroup}>
            {index + 1}.&nbsp;
            <span
              role="presentation"
              className={styles.link}
              onClick={() => handleDownloadDocument(doc)}
            >
              {doc.name}
            </span>
          </p>
        ))}
      </div>
    </IconColumn>
  ) : (
    '-'
  );
};

DocumentColumn.propTypes = { data: PropTypes.object.isRequired };

export default memo(DocumentColumn);
