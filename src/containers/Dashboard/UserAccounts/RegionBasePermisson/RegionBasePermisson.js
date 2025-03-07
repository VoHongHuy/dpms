import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { change } from 'redux-form';
import { v1 } from 'uuid';
import { ACCOUNT_FORM } from '@/constants/forms';
import AddMemberRuleForm from './AddMemberRuleForm';
import ListMemberRule from './ListMemberRule';

import styles from './regionBasePermission.module.scss';

const RegionBasePermission = ({ territorialRegions }) => {
  const dispatch = useDispatch();

  const getRulesFromTerritorialRegions = () => {
    const rules = territorialRegions.map(item => {
      const region = item.split(' ');
      const rule = {
        id: v1(),
        order: region[0],
        operator: region[1],
        country: region[2],
        county: region[3],
        municipality: region[4],
        settlement: region[5],
      };

      return rule;
    });

    return rules;
  };

  const getTerritorialRegionsFromRules = (rules) => {
    const territorialRegions = rules.map(rule => {
      const claimValue = [
        rule.order,
        rule.operator,
        rule.country,
        rule.county,
        rule.municipality,
        rule.settlement,
      ].filter(c => c).join(' ');

      return claimValue;
    });

    return territorialRegions;
  };

  const [state, setState] = useState({
    rules: getRulesFromTerritorialRegions(),
  });

  useEffect(() => () => {
    dispatch(change(ACCOUNT_FORM, 'territorialRegions', []));
  }, []);

  const updateFormState = (input) => {
    let order = 0;
    const rules = input.map(i => {
      order += 1;
      return { ...i, order };
    });
    const territorialRegions = getTerritorialRegionsFromRules(rules);
    dispatch(change(ACCOUNT_FORM, 'territorialRegions', territorialRegions));
    setState(prevState => ({
      ...prevState,
      rules,
    }));
  };

  const handleSortRule = (items) => {
    updateFormState(items);
  };

  const handleRemoveRule = id => {
    const rules = state.rules
      .filter(rule => rule.id !== id);
    updateFormState(rules);
  };

  const handleAddRule = (formValue, reset) => {
    const rules = [
      ...state.rules,
      {
        id: v1(),
        operator: formValue.operator,
        country: formValue.countryId === 'All' ? undefined : formValue.countryId,
        county: formValue.countyId === 'All' ? undefined : formValue.countyId,
        municipality: formValue.municipalityId === 'All' ? undefined : formValue.municipalityId,
        settlement: formValue.settlementId === 'All' ? undefined : formValue.settlementId,
      },
    ];
    updateFormState(rules);
    if (typeof reset === 'function') {
      reset();
    }
  };

  return (
    <div className={styles.container}>
      <AddMemberRuleForm onSubmit={handleAddRule} />
      <ListMemberRule
        items={state.rules}
        onSort={handleSortRule}
        onRemove={handleRemoveRule}
      />
    </div>
  );
};

RegionBasePermission.propTypes = {
  territorialRegions: PropTypes.array.isRequired,
};

export default RegionBasePermission;
