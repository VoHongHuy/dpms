/* eslint-disable react/jsx-no-target-blank */
import React, { memo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchContactInfo, getContactInfo, getFetching } from '@/redux/ducks/results.duck';
import { getCountriesLookup } from '@/redux/ducks/countries.duck';
import { CROATIA_COUNTRY_NAME } from '@/constants/member';
import Loading from '@/components/Loading';

import styles from './contactInformation.module.scss';

const ContactInformation = ({
  county,
  municipality,
  settlement,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const isFetching = useSelector(getFetching);
  const contactInfo = useSelector(getContactInfo);
  const countriesLookup = useSelector(getCountriesLookup);

  const createFilters = () => {
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

    const filters = {
      countyId: countyId ?? null,
      municipalityId: municipalityId ?? null,
      settlementId: settlementId ?? null,
    };

    return filters;
  };

  useEffect(() => {
    const filters = createFilters();
    dispatch(fetchContactInfo({ filters }));
  }, []);

  const renderListItem = (header, value, type = undefined) => {
    let link;

    if (type === 'website') {
      link = <a rel="noopener noreferrer" target="_blank" href={`http://${value}`}>{value}</a>;
    }

    if (type === 'email') {
      link = <a href={`mailto:${value}`}>{value}</a>;
    }

    return value && (
      <div className={styles.listItem}>
        <div className={styles.header}>{intl.formatMessage({ id: header })}:</div>
        <div className={styles.body}>
          {type ? (
            link
          ) : (
            value
          )}
        </div>
      </div>
    );
  };

  const renderContactInfo = () => (
    <div className={styles.list}>
      {renderListItem('RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.COUNTY', contactInfo.county)}
      {renderListItem('RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.ADDRESS', contactInfo.address)}
      {
        renderListItem(
          'RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.WEBSITE',
          contactInfo.website,
          'website',
        )
      }
      {renderListItem('RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.PHONE', contactInfo.phone)}
      {renderListItem('RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.FAX', contactInfo.fax)}
      {
        renderListItem(
          'RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.EMAIL',
          contactInfo.email,
          'email',
        )
      }
      {
        renderListItem(
          'RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.CHIEF',
          contactInfo.chief,
        )
      }
      {
        renderListItem(
          'RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.DEPUTY_CHIEF',
          contactInfo.deputyChief,
        )
      }
      {
        renderListItem(
          'RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.SECOND_DEPUTY_CHIEF',
          contactInfo.secondDeputyChief,
        )
      }
      {
        renderListItem(
          'RESULT.RESULT_DETAILS.TABS.CONTACT.INFO.CHAIRMAIN_OF_REPRESENTATIVE_BODY',
          contactInfo.ChairmanOfRepresentativeBody,
        )
      }
    </div>
  );

  return (
    <div className={styles.container}>
      {
        isFetching ? (
          <div className={styles.center}><Loading /></div>
        ) : (
          <div className={styles.content}>
            {contactInfo ? (
              <div>{renderContactInfo()}</div>
            ) : (
              <div>
                {intl.formatMessage({
                  id: 'RESULT.RESULT_DETAILS.TABS.CONTACT.MESSAGE.NO_INFO',
                })}
              </div>
            )}
          </div>
        )
      }
    </div>
  );
};

ContactInformation.defaultProps = {
  county: null,
  municipality: null,
  settlement: null,
};

ContactInformation.propTypes = {
  county: PropTypes.string,
  municipality: PropTypes.string,
  settlement: PropTypes.string,
};

export default memo(ContactInformation);
