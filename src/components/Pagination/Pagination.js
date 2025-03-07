/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import styles from './pagination.module.scss';

const Pagination = ({
  totalRecords,
  pageIndex,
  pageSize,
  onPageSelected,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const currentPage = pageIndex;
  let startPage = currentPage - 5;
  let endPage = currentPage + 4;
  if (startPage <= 0) {
    endPage -= startPage - 1;
    startPage = 1;
  }
  if (endPage > totalPages) {
    endPage = totalPages;
    if (endPage > 10) {
      startPage = endPage - 9;
    }
  }
  const pages = [];
  // eslint-disable-next-line no-plusplus
  for (let index = startPage; index <= endPage; index++) {
    pages.push(
      <li
        className={`${styles.item} ${index === currentPage ? styles.active : ''}`}
        key={index}
      >
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            onPageSelected(index);
          }}
        >
          {index}
        </a>
      </li>,
    );
  }

  return (
    endPage > 1 && (
      <ul className={styles.pagination}>
        {currentPage > 1 && (
          <>
            <li className={`${styles.item} ${styles.first}`}>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageSelected(1);
                }}
              >
                <FontAwesome name="angle-double-left" />
              </a>
            </li>
            <li className={`${styles.item} ${styles.prev}`}>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageSelected(currentPage - 1);
                }}
              >
                <FontAwesome name="angle-left" />
              </a>
            </li>
          </>
        )}
        {pages}
        {currentPage < totalPages && (
          <>
            <li className={`${styles.item} ${styles.next}`}>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageSelected(currentPage + 1);
                }}
              >
                <FontAwesome name="angle-right" />
              </a>
            </li>
            <li className={`${styles.item} ${styles.next}`}>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageSelected(totalPages);
                }}
              >
                <FontAwesome name="angle-double-right" />
              </a>
            </li>
          </>
        )}
      </ul>
    )
  );
};

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageSelected: PropTypes.func.isRequired,
};

export default memo(Pagination);
