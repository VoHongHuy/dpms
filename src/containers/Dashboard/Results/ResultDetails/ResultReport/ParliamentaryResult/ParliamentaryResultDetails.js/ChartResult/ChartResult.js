import React, { useState, memo, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';
import { v1 } from 'uuid';
import Progress from '@/components/Progress';
import { formatter } from '@/utils';

import styles from './chartResult.module.scss';

const ChartResult = ({ data }) => {
  const intl = useIntl();
  const normalizeData = () => {
    const result = data.map(accordion => ({
      ...accordion,
      isOpened: false,
      key: v1(),
      nestedData: accordion.nestedData.map(nest => ({
        ...nest,
        key: v1(),
      })),
    }));

    return result;
  };

  const initialAccordions = useMemo(() => normalizeData(), []);

  const [accordions, setAccordions] = useState(initialAccordions);

  useEffect(() => {
    const newAccordions = normalizeData(data);
    setAccordions(newAccordions);
  }, [data]);

  const toggleIsOpened = (index) => {
    const accordion = accordions[index];
    const newAccordion = {
      ...accordion,
      isOpened: !accordion.isOpened,
    };
    const newAccordions = accordions.map(
      a => ({
        ...a, isOpened: false,
      }),
    );
    newAccordions.splice(index, 1, newAccordion);
    setAccordions(newAccordions);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        {intl.formatMessage({ id: 'RESULT.RESULT_DETAILS.CHART.TITLE' })}
      </div>
      <div className={styles.accordions}>
        {accordions.map((accordion, index) => (
          <div
            key={accordion.key}
            className={styles.accordion}
            title={`${formatter.number.hr(accordion.percent)}% - ${accordion.text}`}
          >
            <div
              className={styles.header}
              onClick={() => toggleIsOpened(index)}
              aria-hidden="true"
            >
              <Progress percent={accordion.percent} primary>
                {accordion.isOpened ? (
                  <i className="fa fa-caret-up" aria-hidden="true" />
                ) : (
                  <i className="fa fa-caret-down" aria-hidden="true" />
                )} <span>{formatter.number.hr(accordion.percent)}% - {accordion.text}</span>
              </Progress>
            </div>
            <div className={styles.body}>
              <div className={styles.collapse}>
                <Collapse isOpened={accordion.isOpened}>
                  {accordion.nestedData.map(nest => (
                    <div
                      key={nest.key}
                      title={`${formatter.number.hr(nest.percent)}% - ${nest.text}`}
                    >
                      <Progress percent={nest.percent}>
                        <span>{formatter.number.hr(nest.percent)}% - {nest.text}</span>
                      </Progress>
                    </div>
                  ))}
                </Collapse>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ChartResult.defaultProps = {
  data: [],
};

ChartResult.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    percent: PropTypes.string.isRequired,
    nestedData: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      percent: PropTypes.string.isRequired,
    })),
  })),
};

export default memo(ChartResult);
