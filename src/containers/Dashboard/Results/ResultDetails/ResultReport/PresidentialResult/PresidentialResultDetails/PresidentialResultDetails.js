import React, { memo, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { v1 } from 'uuid';
import {
  getFetching,
  getPresidentialResult,
  fetchPresidentialResult,
} from '@/redux/ducks/results.duck';
import { getCountriesLookup } from '@/redux/ducks/countries.duck';
import Loading from '@/components/Loading';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import GeneralResult from '../../GeneralResult';
import ChartResult from './ChartResult';

import styles from './presidentialResultDetails.module.scss';

const PresidentialResultDetails = ({
  electionYear,
  electionRound,
  county,
  municipality,
  settlement,
  electionUnit,
}) => {
  const dispatch = useDispatch();
  const isFetching = useSelector(getFetching);
  const presidentialResult = useSelector(getPresidentialResult);
  const countriesLookup = useSelector(getCountriesLookup);

  const calculatePercent = (value, comparedValue) =>
    ((value * 100) / (comparedValue)).toFixed(2);

  const chartData = useMemo(() => {
    const result = presidentialResult[`round${electionRound}`]
      .presidentialCandidateResult.map(item => ({
        key: v1(),
        text: item.candidateName,
        percent: calculatePercent(
          item.numberOfVotes,
          presidentialResult[`round${electionRound}`].generalResult.totalVoterCount,
        ),
      }));

    return result;
  }, [presidentialResult]);

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
      electionRound,
    };

    dispatch(fetchPresidentialResult(filter));
  }, []);
  return (
    <div className={styles.container}>
      {isFetching ? (
        <div className={styles.center}><Loading /></div>
      ) : (
        <>
          <div className={styles.generalResult}>
            <GeneralResult data={presidentialResult[`round${electionRound}`].generalResult} />
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

PresidentialResultDetails.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  electionUnit: undefined,
};

PresidentialResultDetails.propTypes = {
  electionYear: PropTypes.string.isRequired,
  electionRound: PropTypes.string.isRequired,
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  electionUnit: PropTypes.string,
};

export default memo(PresidentialResultDetails);
