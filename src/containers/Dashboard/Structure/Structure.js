import React from 'react';
import SectionHeader from '@/components/SectionHeader';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  getStructureNodesBackup,
  updateStructureNodes,
  saveStructureNodes,
  getStructureNodes,
} from '@/redux/ducks/structure.duck';
import { PERMISSIONS } from '@/constants/userAccounts';
import { hasPermissions } from '@/utils/user';
import styles from './structure.module.scss';
import StructureSidebar from './StructureSidebar';
import StructureDiagram from './StructureDiagram';

const Structure = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const backupNodes = useSelector(getStructureNodesBackup, shallowEqual);
  const nodes = useSelector(getStructureNodes, shallowEqual);

  const handleUndoClick = () => {
    dispatch(updateStructureNodes({ nodes: backupNodes }));
  };

  const handleSaveClick = () => {
    dispatch(saveStructureNodes({ nodes }));
  };

  const createActions = () => ({
    closeButtonProps: {
      children: intl.formatMessage({
        id: 'STRUCTURES.HEADER.UNDO.BUTTON',
      }),
      onClick: handleUndoClick,
    },
    submitButtonProps: {
      children: intl.formatMessage({
        id: 'STRUCTURES.HEADER.SAVE.BUTTON',
      }),
      onClick: handleSaveClick,
      disabled: !hasPermissions([PERMISSIONS.MODIFY_STRUCTURE.value]),
    },
  });

  return (
    <div className={styles.container}>
      <SectionHeader
        className={styles.title}
        title={intl.formatMessage({ id: 'STRUCTURES.TITLE' })}
        actions={createActions()}
      />
      <div className={styles.content}>
        <StructureSidebar className={styles.leftPanel} />
        <StructureDiagram className={styles.rightSection} />
      </div>
    </div>
  );
};

export default Structure;
