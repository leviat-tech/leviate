import BaseModel from './BaseModel';
import coreLayersSchema from '../schema/coreLayersSchema';

const defaultName = 'Project Layer';

class CoreLayerModel extends BaseModel {
  static schema = coreLayersSchema;

  static maxDepth = 3;

  /**
   * Helper method for better code completion
   * @param [data]
   * @return {LayerModel}
   */
  static create(data) {
    return super.create(data);
  }

  static get coreFields() {
    return {
      ...this.baseFields,
      name: defaultName,
      custom_name: '',
      orderedLayerIds: [],
      orderedPositionIds: [],
    };
  }

  static afterCreate(instance) {
    if (instance.isRoot) {
      instance.addColumn();
      instance.name = useHost().configuration.name;
    }

    if (instance.isRoot || instance.name !== defaultName) return;

    instance.setName();
  }

  static beforeDelete(instance) {
    instance.parent.orderedLayerIds.splice(instance.index, 1);
    instance.parent.updateLayerNames();
  }

  setName() {
    const namePrefix = 'Layer ';
    this.name = namePrefix + this.getNameSuffix();
  }

  getNameSuffix() {
    const { depth, index } = this;

    if (depth === 1) return index + 1;

    let instance = this;
    let currentDepth = depth;
    const indexes = [];

    while (currentDepth > 0) {
      indexes.push(instance.index + 1);
      instance = instance.parent;
      currentDepth -= 1;
    }

    return indexes.reverse().join('.');
  }

  get isRoot() {
    return !this.parentId;
  }

  get isEmpty() {
    return this.layers.length + this.positions.length === 0;
  }

  get siblings() {
    return this.parent.layers;
  }

  /**
   * Get the of the layer relative to its siblings
   * @returns {number}
   */
  get index() {
    if (this.isRoot) return 0;
    return this.parent.orderedLayerIds.indexOf(this.id);
  }

  /**
   * Get the depth of the layer
   * @returns {number}
   */
  get depth() {
    let instance = this;
    let depth = 0;

    while (!instance.isRoot) {
      instance = instance.parent;
      depth += 1;
    }

    return depth;
  }

  get dataToClone() {
    const fieldsToOmit = [
      'id',
      'created_at',
      'updated_at',
      'orderedLayerIds',
      'orderedPositionIds',
      'parentId',
    ];

    return omit(this.$toJSON(), fieldsToOmit);
  }

  clone() {
    if (this.isRoot) {
      throw new Error('Root layer cannot be cloned');
    }

    const newLayer = this.insertAfter(this.dataToClone, false);

    this.clonePositions(newLayer, this.orderedPositionIds);

    this.cloneLayers(newLayer, this.orderedLayerIds);

    this.cloneNestedStructure(newLayer, this.orderedLayerIds);

    return newLayer;
  }

  insertAfter(data, shouldCreatePosition = true) {
    const newLayer = this.parent.addLayer(data, shouldCreatePosition);

    newLayer.moveTo(this.index + 1);

    return newLayer;
  }

  moveTo(moveToIndex) {
    this.parent.orderedLayerIds = arrayMoveItem(this.parent.orderedLayerIds, this.id, moveToIndex);

    this.parent.updateLayerNames();
  }

  updateLayerNames() {
    this.layers.forEach((layer) => {
      layer.setName();
      layer.positions.forEach((position) => position.setName());
    });
  }

  movePosition(positionId, moveToIndex) {
    this.orderedPositionIds = arrayMoveItem(this.orderedPositionIds, positionId, moveToIndex);
    this.updatePositionNames();
  }

  movePositionToLayer(position, layerId, moveToIndex) {
    this.orderedPositionIds.splice(position.index, 1);
    position.layerId = layerId;

    // A new layer has now been assigned to the position
    position.layer.orderedPositionIds.splice(moveToIndex, 0, position.id);

    this.updatePositionNames();
    position.layer.updatePositionNames();
  }

  updatePositionNames() {
    this.positions.forEach((position) => position.setName());
  }
}

export default CoreLayerModel;
