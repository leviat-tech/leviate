class CloneModule {
  constructor(positionModel, layerModel) {
    this.positionModel = positionModel;
    this.layerModel = layerModel;
  }

  clonePositions(layer, positionIds) {
    positionIds.forEach((positionId) => {
      const positionData = this.positionModel.find(positionId).dataToClone();

      layer.addPosition(positionData);
    });
  }

  cloneLayers(layer, layerIds) {
    layerIds.forEach((layerId) => {
      const layerData = this.layerModel.find(layerId).dataToClone();

      layer.addLayer(layerData, false);
    });
  }

  cloneNestedStructure(destination, layerIds) {
    if (!destination.orderedLayerIds.length) {
      return;
    }

    layerIds?.forEach((layerId, index) => {
      const sourceLayer = this.layerModel.find(layerId);
      const destinationLayer = this.layerModel.find(destination.orderedLayerIds[index]);

      this.cloneLayers(destinationLayer, sourceLayer.orderedLayerIds);
      this.clonePositions(destinationLayer, sourceLayer.orderedPositionIds);

      this.cloneNestedStructure(destinationLayer, sourceLayer.orderedLayerIds);
    });
  }
}

export default CloneModule;
