import { omit } from 'lodash-es';

import { useLocalize } from '../plugins/localize';

import BaseModel from '../BaseModel';

const { $L } = useLocalize();

class CorePositionModel extends BaseModel {
  setName() {
    const namePrefix = `${$L('position')} `;
    this.name = namePrefix + this.getNameSuffix();
  }

  getNameSuffix() {
    const positionNumber = this.index + 1;

    if (this.layer.isRoot) return positionNumber;

    return [this.layer.getNameSuffix(), positionNumber].join('.');
  }

  dataToClone(fieldsToOmit = ['id', 'positionId', 'created_at', 'layerId', 'created_at']) {
    return omit(
      {
        ...this.$toJSON(''),
      },
      fieldsToOmit
    );
  }

  insertAfter(data = {}) {
    const { index } = this;
    const newPosition = this.layer.addPosition(data);

    this.layer.movePosition(newPosition.id, index + 1);

    return newPosition;
  }

  clone() {
    return this.insertAfter(this.dataToClone);
  }
}

export default CorePositionModel;
