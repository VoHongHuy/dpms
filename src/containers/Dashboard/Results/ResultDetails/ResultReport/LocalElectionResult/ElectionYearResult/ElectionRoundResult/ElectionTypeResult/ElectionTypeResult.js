import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  fetchLocalElectionCandidateResult,
} from '@/redux/ducks/results.duck';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getCountriesLookup } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import Loading from '@/components/Loading';
import styles from './electionTypeResult.module.scss';
import GeneralResult from '../../../../GeneralResult';
import ChartResult from './ChartResult';

const ElectionTypeResult = ({
  data,
}) => {
  const { county, municipality, settlement, electionUnit } = useParams();

  const countriesLookup = useSelector(getCountriesLookup);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!data.fetchingCandidate && !data.chartData) {
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
        electionType: data.electionType,
        electionYear: data.electionYear,
        electionRound: data.electionRound,
        electionUnitNumber: electionUnit,
        countyId,
        municipalityId,
        settlementId,
      };

      dispatch(fetchLocalElectionCandidateResult(filter));
    }
  }, [data.electionType, data.electionRound, data.electionYear]);

  return (
    <div className={styles.container}>
      <div className={styles.generalResult}>
        {
          data && <GeneralResult data={data} />
        }
      </div>
      {
        data.fetchingCandidate ? (
          <div className={styles.center}><Loading /></div>
        ) : (
          data.chartData && (
            <div className={styles.chartResult}>
              <ChartResult data={data.chartData} />
            </div>
          )
        )
      }
    </div>
  );
};

ElectionTypeResult.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memo(ElectionTypeResult);
