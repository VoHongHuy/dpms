import React, { memo, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import lodash from 'lodash';
import {
  getFetching,
} from '@/redux/ducks/results.duck';
import { getCountriesLookup } from '@/redux/ducks/countries.duck';
import Loading from '@/components/Loading';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import GeneralResult from '../../GeneralResult';
import ChartResult from './ChartResult';

import styles from './parliamentaryResultDetails.module.scss';

const ParliamentaryResultDetails = ({
  electionYear,
  county,
  municipality,
  settlement,
  electionUnit,
  fetchData,
  data,
}) => {
  const isFetching = useSelector(getFetching);
  const countriesLookup = useSelector(getCountriesLookup);

  const calculatePercent = (value, comparedValue) =>
    ((value * 100) / (comparedValue)).toFixed(2);

  const chartData = useMemo(() => {
    const result = [];
    Object.keys(data[electionYear].politicalPartyResult || {}).forEach(key => {
      const element = data[electionYear].politicalPartyResult[key];
      const politicalPartyResultPercent = calculatePercent(
        element.numberOfVotes,
        data[electionYear].generalResult.totalVoterCount,
      );
      const item = {
        text: element.name,
        percent: politicalPartyResultPercent,
        numberOfVotes: element.numberOfVotes,
        nestedData: lodash.orderBy(element.data, ['numberOfVotes'], ['desc']).map(e => ({
          text: e.memberName,
          percent: calculatePercent(e.numberOfVotes, element.numberOfVotes),
        })),
      };
      result.push(item);
    });

    return lodash.orderBy(result, ['numberOfVotes'], ['desc']);
  }, [data]);

  useEffect(() => {
    const countryObj = countriesLookup && countriesLookup[CROATIA_COUNTRY_NAME];
    const countyObj = countryObj
      && countryObj.counties
      && countryObj.counties[county?.toUpperCase()];
    const countyId = countyObj && countyObj.id;

    const municipalityObj = countyObj
      && countyObj.municipalities
      && countyObj.municipalities[municipality?.toUpperCase()];
    const municipalityId = municipalityObj && municipalityObj.id;

    const settlementObj = municipalityObj
      && municipalityObj.settlements
      && municipalityObj.settlements[settlement?.toUpperCase()];
    const settlementId = settlementObj && settlementObj.id;

    const filter = {
      electionUnitNumber: electionUnit,
      countyId,
      municipalityId,
      settlementId,
      electionYear,
    };

    fetchData(filter);
  }, []);
  return (
    <div className={styles.container}>
      {isFetching ? (
        <div className={styles.center}><Loading /></div>
      ) : (
        <>
          <div className={styles.generalResult}>
            <GeneralResult data={data[electionYear].generalResult} />
          </div>
          {
            chartData.length > 0 && (
              <div className={styles.chartResult}>
                <ChartResult data={chartData} />
              </div>
            )
          }
        </>
      )}
    </div>
  );
};

ParliamentaryResultDetails.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
  data: {},
};

ParliamentaryResultDetails.propTypes = {
  electionYear: PropTypes.string.isRequired,
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
  data: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
};

export default memo(ParliamentaryResultDetails);
