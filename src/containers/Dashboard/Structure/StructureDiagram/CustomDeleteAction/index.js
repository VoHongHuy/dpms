import _ from 'lodash';
import { Action, InputType } from '@projectstorm/react-canvas-core';

class CustomDeleteItemsAction extends Action {
  constructor(options = {}) {
    // eslint-disable-next-line no-param-reassign
    options = {
      keyCodes: [46, 8],
      ...options,
    };
    super({
      type: InputType.KEY_DOWN,
      fire: event => {
        if (options.keyCodes.indexOf(event.event.keyCode) !== -1) {
          const selectedEntities = this.engine.getModel().getSelectedEntities();
          if (selectedEntities.length > 0) {
            const confirm = window.confirm('Are you sure you want to delete?');

            if (confirm) {
              _.forEach(selectedEntities, model => {
                // only delete items which are not locked
                if (!model.isLocked()) {
                  model.remove();
                }
              });
              this.engine.repaintCanvas();
            }
          }
        }
      },
    });
  }
}

export default CustomDeleteItemsAction;
