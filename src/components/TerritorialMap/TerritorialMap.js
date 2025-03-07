import React, { useMemo, memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Control from 'react-leaflet-control';
import { ORGANIZATION } from '@/constants';
import InteractiveMap from '@/components/InteractiveMap';
import Breadcrumb from '@/components/Breadcrumb';
import counties from '@/assets/geojson/counties.json';
import municipalities from '@/assets/geojson/municipalities.json';
import zagrebSettlements from '@/assets/geojson/zagreb-settlements.json';
import Settlement from './Settlement';
import District from './District';
import InteractiveMapFilter from '../InteractiveMap/InteractiveMapFilter';

import styles from './territorialMap.module.scss';

const TerritorialMap = ({
  county,
  municipality,
  settlement,
  district,
  links,
  onSelectFeature,
  onClickFeature,
  popupContent,
  onSettlementClick,
  onDistrictClick,
  hasNonZagrebSettlement,
  isShowDistrict,
  tools,
}) => {
  const [regionFilters, setRegionFilters] = useState({});
  const [filteredRegions, setFilteredRegions] = useState(null);

  const zagrebMunicipalityNames = useMemo(() => municipalities.features
    .filter(
      m => m.properties.county.toLowerCase() === ORGANIZATION.COUNTY.ZAGREB
      || m.properties.county.toLowerCase() === ORGANIZATION.COUNTY.GRAD_ZAGREB,
    )
    .map(m => m.properties.name.toLowerCase()),
  []);

  const hasZagrebCounty = useMemo(() =>
    zagrebMunicipalityNames.some(m => m === municipality?.toLowerCase()),
  [zagrebMunicipalityNames, municipality]);

  useEffect(() => {
    if (regionFilters.search) {
      const filteredCounties = counties.features.filter(feature =>
        feature.properties.name.toLowerCase().includes(regionFilters.search.toLowerCase()));
      const filteredMunicipalities = municipalities.features.filter(feature =>
        feature.properties.name.toLowerCase().includes(regionFilters.search.toLowerCase()));
      const filteredSettlements = zagrebSettlements.features.filter(feature =>
        feature.properties.name.toLowerCase().includes(regionFilters.search.toLowerCase()));
      const features = [
        ...filteredCounties,
        ...filteredMunicipalities,
        ...filteredSettlements,
      ];
      const customGeoJson = {
        type: 'FeatureCollection',
        features,
      };
      setFilteredRegions(customGeoJson);
    } else {
      setFilteredRegions(null);
    }
  }, [regionFilters.search]);

  const selectCounties = () => true;

  const selectMunicipalities = selectedCounty => feature =>
    feature.properties.county.toLowerCase() === selectedCounty.toLowerCase();

  const selectZagrebSettlement = selectedMunicipality => feature =>
    feature.properties.municipality?.toLowerCase() === selectedMunicipality.toLowerCase();

  const selectSpecificFeature = featureName => feature =>
    feature.properties.name.toLowerCase() === featureName.toLowerCase();

  const isMapVisible = useMemo(() =>
    !settlement ||
    (!municipality ||
      (municipality && hasZagrebCounty)),
  [settlement, municipality, hasZagrebCounty]);

  const isSettlementListVisible = useMemo(() => hasNonZagrebSettlement && !hasZagrebCounty &&
    municipality && municipality.toLowerCase() !== ORGANIZATION.COUNTY.ZAGREB,
  [municipality, hasNonZagrebSettlement, hasZagrebCounty]);

  const isDistrictVisible = useMemo(() => isShowDistrict && isSettlementListVisible &&
    settlement && settlement.toLowerCase() === ORGANIZATION.SETTLEMENT.OSIJEK,
  [isSettlementListVisible, settlement]);

  const generateMapData = () => {
    let data;
    if (municipality && hasZagrebCounty) {
      data = zagrebSettlements;
    } else if (county) {
      data = municipalities;
    } else {
      data = counties;
    }

    return data;
  };

  const generateMapFilter = () => {
    let filter;
    if (municipality) {
      if (hasZagrebCounty) {
        if (settlement) {
          filter = selectSpecificFeature(settlement);
        } else {
          filter = selectZagrebSettlement(municipality);
        }
      } else {
        filter = selectSpecificFeature(municipality);
      }
    } else if (county) {
      const selectedCounty = county.toLowerCase() === ORGANIZATION.COUNTY.ZAGREB
        ? ORGANIZATION.COUNTY.GRAD_ZAGREB : county;
      filter = selectMunicipalities(selectedCounty);
    } else {
      filter = selectCounties;
    }

    return filter;
  };

  const labelFormatter = (feature) => {
    const label = feature.properties.name.toString();
    return label;
  };

  const mapData = useMemo(() => generateMapData(), [county, municipality, settlement]);
  const mapFilter = useMemo(() => generateMapFilter(), [county, municipality, settlement]);

  const handleFilterChange = debounce(filterValues => {
    setRegionFilters(!filterValues ? {} : { ...regionFilters, ...filterValues });
  }, 300);

  return (
    <>
      <div className={styles.nav}>
        <Breadcrumb links={links} />
        {tools && (
          <div className={styles.tools}>
            {tools}
          </div>
        )}
      </div>
      {
        isSettlementListVisible &&
          (
            <div className={`${styles.settlement} ${!isMapVisible ? styles.noMarginBottom : ''}`}>
              <Settlement
                county={county}
                municipality={municipality}
                settlement={settlement}
                onSettlementClick={onSettlementClick}
              />
            </div>
          )
      }
      {isDistrictVisible && (
        <div className={styles.district}>
          <District
            county={county}
            municipality={municipality}
            settlement={settlement}
            district={district}
            onDistrictClick={onDistrictClick}
          />
        </div>
      )}
      {
        isMapVisible && (
          <div className={styles.map}>
            <InteractiveMap
              labelFieldName="name"
              data={filteredRegions ?? mapData}
              filter={!filteredRegions && mapFilter}
              onSelectFeature={onSelectFeature}
              onClickFeature={onClickFeature}
              labelFormatter={labelFormatter}
              popupContent={popupContent}
              control={(
                <Control position="topright">
                  <InteractiveMapFilter onChange={handleFilterChange} />
                </Control>
              )}
            />
          </div>
        )
      }
    </>
  );
};

TerritorialMap.defaultProps = {
  county: undefined,
  municipality: undefined,
  settlement: undefined,
  district: undefined,
  popupContent: undefined,
  onClickFeature: undefined,
  hasNonZagrebSettlement: true,
  tools: undefined,
  onDistrictClick: undefined,
  isShowDistrict: false,
};

TerritorialMap.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
  district: PropTypes.string,
  links: PropTypes.array.isRequired,
  onSelectFeature: PropTypes.func.isRequired,
  onClickFeature: PropTypes.func,
  popupContent: PropTypes.object,
  onSettlementClick: PropTypes.func.isRequired,
  onDistrictClick: PropTypes.func,
  hasNonZagrebSettlement: PropTypes.bool,
  tools: PropTypes.node,
  isShowDistrict: PropTypes.bool,
};

export default memo(TerritorialMap);
