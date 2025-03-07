/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect, memo } from 'react';
import { v1 } from 'uuid';
import { Map, TileLayer, GeoJSON, Popup, Marker } from 'react-leaflet';
import { debounce } from 'lodash';
import { Browser, divIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { ORGANIZATION } from '@/constants';

import styles from './interactiveMap.module.scss';

const InteractiveMap = ({
  onClickFeature,
  onSelectFeature,
  popupContent,
  data,
  filter,
  labelFormatter,
  popupTitleFormatter,
  control,
}) => {
  const intl = useIntl();
  const geojson = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current && geojson.current) {
      const bounds = geojson.current.leafletElement.getBounds();
      // eslint-disable-next-line no-underscore-dangle
      const { _northEast, _southWest } = bounds;
      if (_northEast && _southWest) {
        map.current.leafletElement.fitBounds(geojson.current.leafletElement.getBounds());
      }
    }
  }, [geojson.current, map.current]);

  const [state, setState] = useState({
    viewport: ORGANIZATION.MAP.DEFAULT_VIEWPORT,
    clickedPosition: null,
    focusFeature: null,
    markers: [],
    geojsonKey: v1(),
  });

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      geojsonKey: v1(),
      markers: [],
    }));
  }, [data, filter]);

  const onViewportChanged = (viewport) => {
    setState(prevState => ({ ...prevState, viewport }));
  };

  function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: 'red',
      fillOpacity: 0.5,
    });

    if (!Browser.ie && !Browser.opera && !Browser.edge) {
      layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    geojson.current.leafletElement.resetStyle(e.target);
  }

  const selectFeature = (selectedFeature) => {
    if (onSelectFeature) {
      onSelectFeature(selectedFeature);
    }
  };

  function clickFeatureHandler(e) {
    const layer = e.target;
    const { latlng } = e;
    const focusFeature = layer.feature;
    if (onClickFeature) {
      onClickFeature(e);
    }
    setState(prevState => ({
      ...prevState,
      clickedPosition: [latlng.lat, latlng.lng],
      focusFeature,
    }));
  }

  const dblClickFeatureHandler = debounce(feature => selectFeature(feature), 400);

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: clickFeatureHandler,
      dblclick: () => dblClickFeatureHandler(feature),
    });
    const label = labelFormatter(feature);
    layer.bindTooltip(label);
    const markerPosition = feature.properties.name === 'Zagrebačka'
      ? [45.70426120956251, 16.136775941632543]
      : layer.getBounds().getCenter();
    const maker = (
      <Marker
        icon={divIcon({
          html: label,
          className: styles.marker,
        })}
        key={v1()}
        position={markerPosition}
        interactive={false}
        clickable={false}
      />
    );
    setState(prevState => ({ ...prevState, markers: [...prevState.markers, maker] }));
  }

  const onFilter = (feature) => !filter || filter(feature);

  return (
    <Map
      ref={map}
      onViewportChanged={onViewportChanged}
      viewport={state.viewport}
    >
      <TileLayer
        // eslint-disable-next-line max-len
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      />
      {
        state.clickedPosition && (
          <Popup key={state.clickedPosition} position={state.clickedPosition}>
            <div className={styles.popupContent}>
              {state.focusFeature && (
                <div className={styles.popupHeader}>
                  {
                    popupTitleFormatter ?
                      popupTitleFormatter((state.focusFeature)) :
                      labelFormatter(state.focusFeature)
                  }
                </div>
              )}
              {popupContent && (
                <div className={styles.popupBody}>{popupContent}</div>
              )}
              <div className={styles.popupFooter}>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    selectFeature(state.focusFeature);
                  }}
                >
                  {intl.formatMessage({ id: 'ORGANIZATION.SELECT' })}
                </a>
              </div>
            </div>
          </Popup>
        )
      }
      {control}
      <GeoJSON
        key={state.geojsonKey}
        fillColor="#77f7f7"
        color="#fff"
        fillOpacity={0.35}
        opacity={1}
        ref={geojson}
        data={data}
        onEachFeature={onEachFeature}
        filter={onFilter}
      />
      <MarkerClusterGroup
        maxClusterRadius={50}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={false}
        zoomToBoundsOnClick={false}
        iconCreateFunction={() => divIcon({ html: '', className: styles.cluster })}
      >
        {state.markers}
      </MarkerClusterGroup>
    </Map>
  );
};

InteractiveMap.defaultProps = {
  onClickFeature: undefined,
  onSelectFeature: undefined,
  popupContent: undefined,
  popupTitleFormatter: undefined,
  control: undefined,
  filter: undefined,
};

InteractiveMap.propTypes = {
  onClickFeature: PropTypes.func,
  onSelectFeature: PropTypes.func,
  popupContent: PropTypes.node,
  data: PropTypes.object.isRequired,
  filter: PropTypes.any,
  labelFormatter: PropTypes.func.isRequired,
  popupTitleFormatter: PropTypes.func,
  control: PropTypes.node,
};

export default memo(InteractiveMap);
