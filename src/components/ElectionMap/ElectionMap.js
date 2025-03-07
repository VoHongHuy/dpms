import React, { memo, useMemo, useState, useEffect } from 'react';
import Control from 'react-leaflet-control';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import InteractiveMap from '@/components/InteractiveMap';
import electionUnits from '@/assets/geojson/election-units.json';
import electionRegions from '@/assets/geojson/election-regions.json';
import { ORGANIZATION } from '@/constants';
import { debounce } from 'lodash';
import InteractiveMapFilter from '@/components/InteractiveMap/InteractiveMapFilter';
import Breadcrumb from '@/components/Breadcrumb';
import PollingStations from './PollingStations';

import styles from './electionMap.module.scss';

const ElectionMap = ({
  electionUnit,
  electionRegion,
  pollingStation,
  links,
  onSelectFeature,
  onClickFeature,
  popupContent,
  onPollingStationClick,
  hasPollingStation,
  tools,
}) => {
  const intl = useIntl();
  const [regionFilters, setRegionFilters] = useState({});
  const [filteredRegions, setFilteredRegions] = useState(null);

  useEffect(() => {
    if (regionFilters.search) {
      const filteredElectionUnits = electionUnits.features.filter(feature =>
        feature.properties.electionUnit.toString().toLowerCase()
          .includes(regionFilters.search.toLowerCase()));
      const filteredElectionRegions = electionRegions.features.filter(feature =>
        feature.properties.municipality.toLowerCase().includes(regionFilters.search.toLowerCase())
        || feature.properties.settlement?.toLowerCase()
          ?.includes(regionFilters.search.toLowerCase()),
      );
      const features = [
        ...filteredElectionUnits,
        ...filteredElectionRegions,
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

  const selectElectionUnits = () => true;

  const selectElectionRegions = selectedElectionUnit => feature =>
    feature.properties.electionUnit === Number(selectedElectionUnit);

  const selectPollingStations = selectedElectionRegion => feature =>
    feature.properties.municipality.toLowerCase() === selectedElectionRegion.toLowerCase() ||
    feature.properties.settlement?.toLowerCase() === selectedElectionRegion.toLowerCase();

  const generateMapData = () => {
    let data;
    if (electionUnit) {
      data = electionRegions;
    } else {
      data = electionUnits;
    }

    return data;
  };

  const generateMapFilter = () => {
    let filter;
    if (electionRegion) {
      filter = selectPollingStations(electionRegion);
    } else if (electionUnit) {
      filter = selectElectionRegions(electionUnit);
    } else {
      filter = selectElectionUnits;
    }

    return filter;
  };

  const mapData = useMemo(() => generateMapData(),
    [electionUnit, electionRegion, pollingStation]);

  const mapFilter = useMemo(() => generateMapFilter(),
    [electionUnit, electionRegion, pollingStation]);

  const labelFormatter = (feature) => {
    let label;
    const {
      municipality,
      settlement,
      type,
      electionUnit,
    } = feature.properties;

    if (type) {
      if (type === ORGANIZATION.TYPE.MUNICIPALITY) {
        label = municipality;
      } else {
        label = settlement;
      }
    } else {
      label = `${electionUnit}.`;
    }

    return label;
  };

  const popupTitleFormatter = (feature) => {
    let title;
    const {
      municipality,
      settlement,
      type,
      electionUnit,
    } = feature.properties;

    if (type) {
      if (type === ORGANIZATION.TYPE.MUNICIPALITY) {
        title = municipality;
      } else {
        title = settlement;
      }
    } else {
      title = intl.formatMessage({ id: 'ORGANIZATION.ELECTION_UNIT' }, { electionUnit });
    }

    return title;
  };

  const handleFilterChange = debounce(filterValues => {
    setRegionFilters(!filterValues ? {} : { ...regionFilters, ...filterValues });
  }, 300);

  const isPollingStationsVisible = useMemo(
    () => electionRegion && hasPollingStation,
    [electionRegion],
  );
  const isMapVisible = useMemo(() => !pollingStation, [pollingStation]);

  const handlePollingStationClick = (pollingStation) => {
    if (onPollingStationClick) {
      onPollingStationClick(pollingStation);
    }
  };

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
        isPollingStationsVisible && (
          <div className={`${styles.pollingStations}
              ${!isMapVisible ? styles.noMarginBottom : ''}`}
          >
            <PollingStations onPollingStationClick={handlePollingStationClick} />
          </div>
        )
      }
      {
        isMapVisible && (
          <div className={styles.map}>
            <InteractiveMap
              data={filteredRegions ?? mapData}
              filter={!filteredRegions && mapFilter}
              onSelectFeature={onSelectFeature}
              labelFormatter={labelFormatter}
              onClickFeature={onClickFeature}
              popupTitleFormatter={popupTitleFormatter}
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

ElectionMap.defaultProps = {
  electionUnit: undefined,
  electionRegion: undefined,
  pollingStation: undefined,
  popupContent: undefined,
  onClickFeature: undefined,
  onPollingStationClick: undefined,
  hasPollingStation: true,
  tools: undefined,
};

ElectionMap.propTypes = {
  electionUnit: PropTypes.string,
  electionRegion: PropTypes.string,
  pollingStation: PropTypes.string,
  links: PropTypes.array.isRequired,
  onSelectFeature: PropTypes.func.isRequired,
  onClickFeature: PropTypes.func,
  popupContent: PropTypes.object,
  onPollingStationClick: PropTypes.func,
  hasPollingStation: PropTypes.bool,
  tools: PropTypes.node,
};

export default memo(ElectionMap);
