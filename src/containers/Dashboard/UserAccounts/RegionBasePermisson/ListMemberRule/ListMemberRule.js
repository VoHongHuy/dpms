/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { ReactSortable } from 'react-sortablejs';
import { useSelector } from 'react-redux';
import { getCountries } from '@/redux/ducks/countries.duck';

import styles from './listMemberRule.module.scss';

const ListMemberRule = ({ items, onSort, onRemove }) => {
  const intl = useIntl();
  const countriesLookup = useSelector(getCountries);
  const rules = useMemo(() => {
    const result = items.map(rule => {
      const countryObj = rule.country
        && countriesLookup
        && countriesLookup.find(m => m.id === Number(rule.country));
      const countryName = countryObj && countryObj.name;

      const countyObj = rule.county
        && countryObj
        && countryObj.counties
        && countryObj.counties.find(m => m.id === Number(rule.county));
      const countyName = countyObj && countyObj.name;

      const municipalityObj = rule.municipality
        && countyObj
        && countyObj.municipalities
        && countyObj.municipalities.find(m => m.id === Number(rule.municipality));
      const municipalityName = municipalityObj && municipalityObj.name;

      const settlementObj = rule.settlement
        && municipalityObj
        && municipalityObj.settlements
        && municipalityObj.settlements.find(m => m.id === Number(rule.settlement));
      const settlementName = settlementObj && settlementObj.name;
      const operatorName = rule.operator === '1'
        ? intl.formatMessage({ id: 'TABLE.ALLOW.TEXT' })
        : intl.formatMessage({ id: 'TABLE.DISALLOW.TEXT' });

      return {
        id: rule.id,
        order: rule.order,
        operator: operatorName,
        country: countryName,
        county: countyName,
        municipality: municipalityName,
        settlement: settlementName,
        operatorStatus: rule.operator,
      };
    });

    return result;
  }, [items, countriesLookup]);

  const handleRemove = (event, id) => {
    event.preventDefault();
    onRemove(id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.listMemberRule}>
        {
          rules.length === 0 ? (
            <div className={styles.message}>
              {intl.formatMessage({ id: 'TABLE.EMPTY.TEXT' })}
            </div>
          ) : (
            <ReactSortable
              list={items}
              setList={onSort}
            >
              {rules.map(item => (
                <div className={styles.item} key={item.id}>
                  <div
                    title={item.order}
                    className={styles.order}
                  >
                    {item.order}
                  </div>
                  <div
                    title={item.country ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                    className={styles.country}
                  >
                    {item.country ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                  </div>
                  <div
                    title={item.county ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                    className={styles.county}
                  >
                    {item.county ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                  </div>
                  <div
                    title={item.municipality ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                    className={styles.municipality}
                  >
                    {item.municipality ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                  </div>
                  <div
                    title={item.settlement ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                    className={styles.settlement}
                  >
                    {item.settlement ?? intl.formatMessage({ id: 'TABLE.ALL.TEXT' })}
                  </div>
                  <div
                    title={item.operator}
                    className={`${styles.operator} ${item.operatorStatus === '1'
                      ? styles.allow
                      : styles.disallow}`}
                  >
                    {item.operator}
                  </div>
                  <div className={styles.actions}>
                    <a href="#" onClick={e => handleRemove(e, item.id)}>
                      {intl.formatMessage({ id: 'TABLE.REMOVE.TEXT' })}
                    </a>
                  </div>
                </div>
              ))}
            </ReactSortable>
          )
        }
      </div>
    </div>
  );
};

ListMemberRule.propTypes = {
  items: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default memo(ListMemberRule);
