import React, { memo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteNoteResult } from '@/redux/ducks/results.duck';
import Pagination from '@/components/Pagination';
import ConfirmModal from '@/components/ConfirmModal';
import ResultNoteFilter from './ResultNoteFilter';
import ResultNoteTable from './ResultNoteTable';
import ResultNoteControl from './ResultNoteControl';

import styles from './resultNoteList.module.scss';

const ResultNoteList = ({
  data,
  countyId,
  municipalityId,
  settlementId,
  electionUnitNumber,
  refresh,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const [filteredNotes, setFilteredNotes] = useState(data);
  const [deletedNote, setDeletedNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, rowPerPage: 8 });
  const [paginationNotes, setPaginationNotes] = useState([]);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    const filteredNotes = data.filter(note =>
      (!filters.author || note.author.toUpperCase().includes(filters.author.toUpperCase()))
      && (!filters.note || note.note.toUpperCase().includes(filters.note.toUpperCase())) && (
        !filters.unitName || (
          note.county?.includes(filters.unitName.toUpperCase())
          || note.municipality?.toUpperCase()?.includes(filters.unitName.toUpperCase())
          || note.settlement?.toUpperCase()?.includes(filters.unitName.toUpperCase())
          || note.electionUnitNumber?.toString(8)?.includes(filters.unitName)
        )
      ));
    setFilteredNotes(filteredNotes);
    setPagination({
      ...pagination,
      page: 1,
    });
  }, [data, filters]);

  useEffect(() => {
    const paginationData = filteredNotes.slice(
      (pagination.page - 1) * pagination.rowPerPage, pagination.page * pagination.rowPerPage,
    );
    setPaginationNotes(paginationData);
  }, [filteredNotes, pagination]);

  const handleDeleteNote = (note) => {
    toggleModal();
    setDeletedNote(note);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
  };

  const handleModalOk = () => {
    dispatch(deleteNoteResult({
      data: deletedNote,
      callback: () => {
        refresh();
        toggleModal();
      },
    }));
  };

  const handleFilterChange = filterValues => {
    setFilters(!filterValues ? {} : { ...filters, ...filterValues });
  };

  const selectPageHandler = (pageIndex) => {
    setPagination({
      ...pagination,
      page: pageIndex,
    });
  };

  return (
    <div className={styles.container}>
      <ResultNoteFilter onChange={handleFilterChange} />
      <ResultNoteControl
        data={selectedNote}
        countyId={countyId}
        municipalityId={municipalityId}
        settlementId={settlementId}
        electionUnitNumber={electionUnitNumber}
        refresh={refresh}
      />
      <ResultNoteTable
        data={paginationNotes}
        onDeleteNote={handleDeleteNote}
        onEditNote={handleEditNote}
      />
      <div className={styles.paginationContainer}>
        <Pagination
          pageIndex={pagination.page}
          pageSize={pagination.rowPerPage}
          totalRecords={filteredNotes.length}
          onPageSelected={selectPageHandler}
        />
      </div>
      <ConfirmModal
        toggle={toggleModal}
        open={openModal}
        okButtonProps={{ onClick: handleModalOk }}
      >
        {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.TABS.NOTES.DELETE_MODAL_MESSAGE' })}
      </ConfirmModal>
    </div>
  );
};

ResultNoteList.defaultProps = {
  data: [],
  countyId: undefined,
  municipalityId: undefined,
  settlementId: undefined,
  electionUnitNumber: undefined,
};

ResultNoteList.propTypes = {
  data: PropTypes.array,
  countyId: PropTypes.number,
  municipalityId: PropTypes.number,
  settlementId: PropTypes.number,
  electionUnitNumber: PropTypes.number,
  refresh: PropTypes.func.isRequired,
};

export default memo(ResultNoteList);
