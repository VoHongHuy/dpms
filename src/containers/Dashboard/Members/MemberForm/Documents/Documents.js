import React, { memo, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { change } from 'redux-form';
import { getCurrentUser } from '@/redux/ducks/auth.duck';
import { FormSection } from '@/components/Form';
import { filterDataByObject, generateId } from '@/utils';
import { MEMBER_FORM } from '@/constants/forms';
import {
  uploadDocuments,
  deleteDocument,
  downloadDocument,
  getDocuments,
} from '@/redux/ducks/members.duck';

import Filters from './Filters';
import TableDocuments from './TableDocuments';
import UploadButton from './UploadButton';
import styles from './documents.module.scss';

const Documents = ({ data, hideDownloadAction, readOnly }) => {
  const [filters, setFilters] = useState({});
  const [documents, setDocuments] = useState((data && data.documents) || []);
  const [isUploading, setUploadStatus] = useState(false);
  const [isDeleting, setDeleteStatus] = useState(false);
  const [isDownloading, setDownloadStatus] = useState(false);
  const intl = useIntl();
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const modifiedDocuments = useMemo(
    () =>
      documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        isLocal: doc.isLocal,
        addedBy: `${doc.createdByUserName} (${doc.createdByUserEmail})`,
      })),
    [documents],
  );
  const filteredData = useMemo(
    () => filterDataByObject(modifiedDocuments, filters),
    [modifiedDocuments, filters],
  );

  useEffect(() => {
    if (data && data.documents) {
      setDocuments(data.documents);
    }
  }, [data && data.documents]);

  const handleFilterChange = filterValues => {
    setFilters(!filterValues ? {} : { ...filters, ...filterValues });
  };

  const handleSetDocumentsInForm = documents => {
    const localDocuments = documents.filter(doc => doc.isLocal);
    dispatch(change(MEMBER_FORM, 'documents', localDocuments));
  };

  const handleFileUpload = ({ target: { files } }) => {
    const file = files && files[0];
    if (!file) return;
    if (data && data.id) {
      const document = {
        id: generateId(),
        file,
        name: file.name,
        createdTime: Date.now(),
        isLocal: false,
        createdByUserName: currentUser.name,
        createdByUserEmail: currentUser.preferred_username,
      };
      setUploadStatus(true);
      dispatch(
        uploadDocuments({
          memberId: data.id,
          documents: [document],
          callback: success => {
            if (success) {
              dispatch(
                getDocuments({
                  memberId: data.id,
                  callback: () => setUploadStatus(false),
                }),
              );
            }
          },
        }),
      );
    } else {
      const newDocuments = [
        ...documents,
        {
          id: generateId(),
          file,
          name: file.name,
          createdTime: Date.now(),
          isLocal: true,
          createdByUserName: currentUser.name,
          createdByUserEmail: currentUser.preferred_username,
        },
      ];
      setDocuments(newDocuments);
      handleSetDocumentsInForm(newDocuments);
    }
  };

  const handleDeleteDocument = document => {
    const newDocuments = [...documents];
    if (document.isLocal) {
      newDocuments.splice(
        documents.findIndex(doc => doc.id === document.id),
        1,
      );
      setDocuments(newDocuments);
      handleSetDocumentsInForm(newDocuments);
    } else if (data && data.id) {
      setDeleteStatus(true);
      dispatch(
        deleteDocument({
          memberId: data.id,
          documentId: document.id,
          callback: success => {
            setDeleteStatus(false);
            if (success) {
              newDocuments.splice(
                documents.findIndex(doc => doc.id === document.id),
                1,
              );
              setDocuments(newDocuments);
              handleSetDocumentsInForm(newDocuments);
            }
          },
        }),
      );
    }
  };

  const handleDownloadDocument = document => {
    if (document.isLocal) return;
    setDownloadStatus(true);
    dispatch(
      downloadDocument({
        memberId: data.id,
        documentId: document.id,
        callback: () => {
          setDownloadStatus(false);
        },
      }),
    );
  };

  return (
    <FormSection
      label={intl.formatMessage({
        id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.LABEL',
      })}
      className={styles.container}
    >
      {!readOnly ? (
        <UploadButton onChange={handleFileUpload} disabled={isUploading}>
          {intl.formatMessage({
            id: 'MEMBERS.DETAILS.SECTION.DOCUMENTS.UPLOAD',
          })}
          <i className="icon-plus" />
        </UploadButton>
      ) : null}
      <Filters onChange={handleFilterChange} />
      <TableDocuments
        data={filteredData}
        downloadButtonProps={{
          hidden: hideDownloadAction,
          onClick: handleDownloadDocument,
          loading: isDownloading,
        }}
        deleteButtonProps={{
          hidden: readOnly,
          onClick: handleDeleteDocument,
          loading: isDeleting,
        }}
      />
    </FormSection>
  );
};

Documents.defaultProps = {
  data: {},
  hideDownloadAction: false,
  readOnly: false,
};
Documents.propTypes = {
  data: PropTypes.object,
  hideDownloadAction: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default memo(Documents);
