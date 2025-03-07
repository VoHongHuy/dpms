/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';
import { PortWidget, PortModelAlignment } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import {
  updateStructureNodeName,
  getStructureNodes,
  getSelectedNodes,
  updateStructureNodePosition,
} from '@/redux/ducks/structure.duck';
import ConfirmModal from '@/components/ConfirmModal';
import styles from './MemberNode.module.scss';
import fullscreenExit from '../../../../../assets/icons/fullscreen-exit.png';
import fullscreenExpand from '../../../../../assets/icons/fullscreen-expand.png';
import checkbox from '../../../../../assets/icons/node-title-checkbox.png';
import close from '../../../../../assets/icons/node-title-close-circle.png';
import deleteIcon from '../../../../../assets/icons/delete.png';

const Port = styled.div`
  width: 16px;
  height: 16px;
  z-index: 10;
  background: #f0c11b;

  cursor: pointer;
  margin: 0px auto;

  &:hover {
    background: rgba(0, 0, 0, 1);
  }
`;

let originalTitle = '';

const MemberNode = ({ engine, node, data }) => {
  const intl = useIntl();
  const [isBodyShow, setBodyShow] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isEditTitle, setEditTitle] = useState(false);
  const dispatch = useDispatch();
  const structureNodes = useSelector(getStructureNodes, shallowEqual);
  const selectedNodes = useSelector(getSelectedNodes, shallowEqual);

  useEffect(() => {
    setTitle(data.name);
    originalTitle = data.name;

    node.registerListener({
      positionChanged: e => {
        dispatch(
          updateStructureNodePosition({
            id: e.entity.data.id,
            position: e.entity.position,
            localData: structureNodes,
          }),
        );
      },
    });

    return () => {
      node.clearListeners();
    };
  }, [structureNodes]);

  const handleBodyShowClick = () => {
    setBodyShow(!isBodyShow);
    engine.repaintCanvas();
  };

  const handleTitleOk = e => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      updateStructureNodeName({
        id: data.id,
        name: title,
        localData: structureNodes,
        callback: () => engine.repaintCanvas(),
      }),
    );
    originalTitle = title;
    setEditTitle(false);
  };

  const handleTitleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setEditTitle(false);
    setTitle(originalTitle);
  };

  const handleTitleDoubleClick = e => {
    setEditTitle(true);

    const input = e.target;

    input.focus();
  };

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleModalOk = () => {
    const nodeModel = engine.getModel().getNode(data.id);
    nodeModel.remove();
    engine.repaintCanvas();
  };

  const memberInfoStyle = selectedNodes.includes(data.id) ? styles.onSelect : '';

  return (
    <div className={styles.container}>
      <PortWidget
        style={{
          top: 0,
          position: 'relative',
        }}
        port={node.getPort(PortModelAlignment.TOP)}
        engine={engine}
      >
        <Port />
      </PortWidget>
      <div className={memberInfoStyle}>
        <div className={styles.titleContainer}>
          <input
            className={styles.titleInput}
            placeholder={
              intl.formatMessage({ id: 'STRUCTURES.DIAGRAM.NODE.TITLE.INPUT.PLACEHOLDER' })
            }
            onChange={handleTitleChange}
            value={title || ''}
            readOnly={!isEditTitle}
            onDoubleClick={handleTitleDoubleClick}
          />
          <span className={styles.titleButtonContainer} hidden={!isEditTitle}>
            <a
              role="button"
              onClick={handleTitleOk}
              className={styles.fullscreenBodyButton}
              tabIndex="0"
            >
              <img alt="convert icon" src={checkbox} />
            </a>
            <a
              role="button"
              onClick={handleTitleCancel}
              className={styles.fullscreenBodyButton}
              tabIndex="0"
            >
              <img alt="convert icon" src={close} />
            </a>
          </span>
        </div>
        {!data.memberId ? null : (
          <div className={styles.body}>
            <div className={styles.name}>
              {data.memberName} {data.surname}
              <a
                role="button"
                onClick={handleBodyShowClick}
                className={styles.fullscreenBodyButton}
                onKeyDown={handleBodyShowClick}
                tabIndex="0"
              >
                <img
                  alt="convert icon"
                  src={isBodyShow ? fullscreenExit : fullscreenExpand}
                />
              </a>
            </div>
            {!isBodyShow ? null : (
              <>
                <div>
                  {intl.formatMessage({
                    id: 'STRUCTURES.LEFT.MEMBER_CARD.SSN',
                  })}
                </div>
                <div className={styles.content}>{data.ssn}</div>
                {data.address && (
                  <>
                    <div>
                      {intl.formatMessage({
                        id: 'STRUCTURES.LEFT.MEMBER_CARD.ADDRESS',
                      })}
                    </div>
                    <div className={styles.content}>{data.address}</div>
                  </>
                )}
                {data.contactNumber && (
                  <>
                    <div>
                      {intl.formatMessage({
                        id: 'STRUCTURES.LEFT.MEMBER_CARD.CONTACT_NUMBER',
                      })}
                    </div>
                    <div className={styles.content}>{data.contactNumber}</div>
                  </>
                )}
                {data.email && (
                  <>
                    <div>Email:</div>
                    <div className={styles.content}>{data.email}</div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <PortWidget
        style={{
          top: 0,
          position: 'relative',
        }}
        port={node.getPort(PortModelAlignment.BOTTOM)}
        engine={engine}
      >
        <Port />
      </PortWidget>
      <a
        role="button"
        onClick={handleDeleteClick}
        className={styles.deleteButton}
        tabIndex="0"
      >
        <img alt="convert icon" src={deleteIcon} />
      </a>
      <ConfirmModal
        toggle={toggleModal}
        open={isModalOpen}
        okButtonProps={{ onClick: handleModalOk }}
      >
        {intl.formatMessage({
          id: 'STRUCTURES.MODAL.DELETE.DESCRIPTION',
        })}
      </ConfirmModal>
    </div>
  );
};

MemberNode.defaultProps = {};

MemberNode.propTypes = {
  node: PropTypes.shape({
    getPort: PropTypes.func.isRequired,
    registerListener: PropTypes.func,
    clearListeners: PropTypes.func,
  }).isRequired,
  engine: PropTypes.shape({
    repaintCanvas: PropTypes.func.isRequired,
    getModel: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    memberName: PropTypes.string,
    surname: PropTypes.string,
    memberId: PropTypes.string,
    ssn: PropTypes.string,
    address: PropTypes.string,
    contactNumber: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default MemberNode;
