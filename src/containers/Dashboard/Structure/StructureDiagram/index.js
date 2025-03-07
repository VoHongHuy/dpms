import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import createEngine, {
  DiagramModel,
  PortModelAlignment,
  DefaultLinkFactory,
  DefaultDiagramState,
  DefaultPortModel,
  DefaultNodeModel,
} from '@projectstorm/react-diagrams';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  getStructureNodes,
  fetchStructureNodes,
  createStructureNode,
  updateStructureNodeLink,
  unlinkNodes,
  deleteStructureNodes,
  selectStructureNode,
  getSelectedNodes,
} from '@/redux/ducks/structure.duck';
import _ from 'lodash';
import MemberNodeFactory from './MemberNode/MemberNodeFactory';
import MemberNodeModel from './MemberNode/MemberNodeModel';
import { unitDragDataKey } from '../StructureSidebar';
import { memberDragDataKey } from '../MemberCard';
import StructureDiagramCanvas from './StructureDiagramCanvas.js';

const createNode = data => {
  const nodePosition = { x: data.positionX, y: data.positionY };

  const model = new MemberNodeModel(data.id, nodePosition);

  model.setData(data);

  return model;
};

const getAllChildNodeIds = nodeData => {
  const allChildNodeIds = [];
  const nodeChildren = nodeData.children;

  if (nodeChildren && nodeChildren.length > 0) {
    const childIds = nodeData.children.map(x => x.id);
    allChildNodeIds.push(...childIds);

    const nestedChildrenIds = nodeChildren.flatMap(x => getAllChildNodeIds(x));
    allChildNodeIds.push(...nestedChildrenIds);
  }

  const allChildNodeIdsUnique = [...new Set(allChildNodeIds)];

  return allChildNodeIdsUnique;
};

const iterate = (nodes, drawNode, parent = null) => {
  if (!nodes || !nodes.length || Number.isNaN(nodes.length)) {
    return;
  }

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];

    drawNode(node, parent);
    if (node.children && node.children.length && node.children.length > 0) {
      iterate(node.children, drawNode, node);
    }
  }
};

const drawNode = nodeModels => (node, parent) => {
  const model = createNode(node);

  const bottomPort = new DefaultPortModel(false, PortModelAlignment.BOTTOM);
  model.addPort(bottomPort);
  const topPort = new DefaultPortModel(true, PortModelAlignment.TOP);
  model.addPort(topPort);

  if (parent && parent.diagramModel) {
    const parentPort = parent.diagramModel.getPort(PortModelAlignment.BOTTOM);
    const link = topPort.link(parentPort);
    nodeModels.push(link);
  }
  // eslint-disable-next-line no-param-reassign
  node.diagramModel = model;

  nodeModels.push(model);
};

// create an engine without registering DeleteItemsAction
const engine = createEngine();
engine.maxNumberPointsPerLink = 0;

const handleDrop = event => {
  let data = event.dataTransfer.getData(unitDragDataKey);

  if (!data) {
    data = event.dataTransfer.getData(memberDragDataKey);
  }

  data = JSON.parse(data);

  const nodePosition = engine.getRelativeMousePoint(event);
  data.positionX = nodePosition.x;
  data.positionY = nodePosition.y;

  const nodeModel = new MemberNodeModel(data.id, nodePosition);

  nodeModel.setData(data);

  // add top and bottom connect port
  nodeModel.addPort(new DefaultPortModel(false, PortModelAlignment.BOTTOM));
  const topPort = nodeModel.addPort(
    new DefaultPortModel(true, PortModelAlignment.TOP),
  );

  engine.getModel().addAll(nodeModel);

  // add link if drop on a node
  const underMouseElement = engine.getMouseElement(event);

  if (underMouseElement && (underMouseElement instanceof DefaultNodeModel)) {
    const targetPort = underMouseElement.getPort(PortModelAlignment.BOTTOM);
    const link = topPort.link(targetPort);

    // fix link displays in wrong position
    topPort.reportPosition();
    targetPort.reportPosition();

    engine.getModel().addAll(link);
  }

  engine.repaintCanvas();
};

const handleDragOver = event => {
  event.preventDefault();
};

engine.getLinkFactories().registerFactory(new DefaultLinkFactory());
engine.getNodeFactories().registerFactory(new MemberNodeFactory());

const linkNodes = (model, link, structureNodes, dispatch) => {
  const { sourcePort, targetPort } = link;

  const isSourcePortNodeParent = !sourcePort.options.in;

  const parentPort = isSourcePortNodeParent ? sourcePort : targetPort;
  const childPort = isSourcePortNodeParent ? targetPort : sourcePort;

  const parentNodeData = parentPort.parent.data;
  const childNodeData = childPort.parent.data;

  const childNodeChildrenIds = getAllChildNodeIds(childNodeData);
  const circularThroughChildren = childNodeChildrenIds.includes(parentNodeData.id);
  const linkingToItself = parentNodeData.id === childNodeData.id;

  const childAlreadyHasParent = Object.keys(childPort.parent.portsIn[0].links).length > 1;

  if (linkingToItself || circularThroughChildren || childAlreadyHasParent) {
    model.removeLink(link);
    return;
  }

  dispatch(
    updateStructureNodeLink({
      parentId: parentNodeData.id,
      childId: childNodeData.id,
      localData: structureNodes,
    }),
  );
};

const registerDiagramModelEvent = (model, dispatch, structureNodes) => {
  // add event listener to diagram model
  model.registerListener({
    nodesUpdated: nodesUpdatedEvent => {
      // ignore delete event because it has been handle inside MemberNode
      if (!nodesUpdatedEvent.isCreated) {
        dispatch(
          deleteStructureNodes({
            id: nodesUpdatedEvent.node.data.id,
            localNodes: structureNodes,
          }),
        );
      } else {
        dispatch(
          createStructureNode({
            data: nodesUpdatedEvent.node.data,
            localData: structureNodes,
          }),
        );
      }
    },
    linksUpdated: linksUpdatedEvent => {
      const { link } = linksUpdatedEvent;
      const { sourcePort, targetPort } = link;

      if (linksUpdatedEvent.isCreated) {
        if (sourcePort && sourcePort.parent && targetPort && targetPort.parent) {
          linkNodes(model, link, structureNodes, dispatch);
          return;
        }

        linksUpdatedEvent.link.registerListener({
          targetPortChanged: targetPortEvent => {
            const link = targetPortEvent.entity;
            linkNodes(model, link, structureNodes, dispatch);
          },
        });
      } else {
        // Link is about to be deleted
        if (!sourcePort || !targetPort || !sourcePort.parent || !targetPort.parent) {
          return;
        }

        const isSourcePortNodeParent = !sourcePort.options.in;
        const parentNode = isSourcePortNodeParent ? sourcePort.parent : targetPort.parent;
        const childNode = isSourcePortNodeParent ? targetPort.parent : sourcePort.parent;

        const rootNodeIDs = structureNodes.map(x => x.id);
        const rootNodeChildrenIDs = structureNodes.flatMap(x => getAllChildNodeIds(x));
        const allNodeIDs = rootNodeIDs.concat(rootNodeChildrenIDs);

        const parentNodeInLocalData = allNodeIDs.indexOf(parentNode.data.id) !== -1;
        const childNodeInLocalData = allNodeIDs.indexOf(childNode.data.id) !== -1;

        if (!parentNodeInLocalData || !childNodeInLocalData) {
          // Node and it's links were deleted beforehand, e.g. in nodesUpdated
          return;
        }

        dispatch(
          unlinkNodes({
            parentId: parentNode.data.id,
            childId: childNode.data.id,
            localData: structureNodes,
          }),
        );
      }
    },
  });
};

const StructureDiagram = ({ className }) => {
  const dispatch = useDispatch();
  const structureNodes = useSelector(getStructureNodes, shallowEqual);
  const selectedNodes = useSelector(getSelectedNodes, shallowEqual);
  const { positionX, positionY } = useParams();
  const model = new DiagramModel();

  useEffect(() => {
    dispatch(fetchStructureNodes({}));
  }, []);

  const memberNodeModels = [];

  // draw diagram node from data
  const drawNodeFn = drawNode(memberNodeModels);
  const nodesForDraw = _.cloneDeep(structureNodes);
  iterate(nodesForDraw, drawNodeFn);

  memberNodeModels.forEach(node => {
    // add a selection listener to each
    node.registerListener({
      selectionChanged: e => {
        if (!(e.entity instanceof DefaultNodeModel)) {
          return;
        }

        dispatch(
          selectStructureNode({
            id: e.entity.data.id,
            isSelected: e.isSelected,
            localSelectedNodes: selectedNodes,
          }),
        );
      },
    });

    model.addAll(node);
  });

  const engineState = engine.getStateMachine().getCurrentState();
  if (engineState instanceof DefaultDiagramState) {
    engineState.dragNewLink.config.allowLooseLinks = false;
  }

  registerDiagramModelEvent(model, dispatch, structureNodes);

  engine.setModel(model);

  useEffect(() => {
    if (engine.canvas && positionX && positionY) {
      const canvasSize = {
        width: engine.canvas?.offsetWidth,
        height: engine.canvas?.offsetHeight,
      };

      const position = {
        x: canvasSize.width / 2 - (Number(positionX) + 256 / 2),
        y: canvasSize.height / 2 - (Number(positionY) + 115 / 2),
      };

      model.setOffset(position.x, position.y);
    }
  }, [engine, model, positionY, positionY]);

  return (
    <div className={className} onDrop={handleDrop} onDragOver={handleDragOver}>
      <StructureDiagramCanvas model={model} engine={engine} />
    </div>
  );
};

StructureDiagram.defaultProps = {
  className: '',
};

StructureDiagram.propTypes = {
  className: PropTypes.string,
};

export default StructureDiagram;
