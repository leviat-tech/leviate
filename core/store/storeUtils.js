import { each } from 'lodash-es';

function deleteEntitiesWithNoId(entitiesState) {
  let isModified = false;

  each(entitiesState, entities => {
    each(entities.dataById, (entity, id) => {
      if (!entity.id) {
        isModified = true;
        delete entities.dataById[id];
      }
    });
  });

  return isModified;
}

function checkLayerForObsoletePositions(entitiesState) {
  const positions = entitiesState.positions.dataById;
  const layers = entitiesState.layers.dataById;

  let isModified = false;

  each(layers, layer => {
    const positionIdsToDeleteFromLayer = [];

    layer.orderedPositionIds.forEach(id => {
      if (!positions[id]) {
        positionIdsToDeleteFromLayer.push(id);
      }
    });

    // Remove from orderedPositionIds if position with id does not exist
    if (positionIdsToDeleteFromLayer.length > 0) {
      layer.orderedPositionIds = layer.orderedPositionIds.filter(id => {
        return !positionIdsToDeleteFromLayer.includes(id);
      });

      isModified = true;
    }
  });

  return isModified;
}

function addOrphanedPositionsToLayer(entitiesState) {
  const positions = entitiesState.positions.dataById;
  const layers = entitiesState.layers.dataById;

  let isModified = false;

  each(positions, (position, id) => {
    const layer = layers[position.layerId];
    const layerPositionIds = entitiesState.positions.idsByForeignKey.layerId[layer.id];

    // Can't find layer relation so delete position
    if (!layer || !layerPositionIds.includes(id)) {
      delete position[id];
      isModified = true;
    }

    const isMissingFromLayer = !layer.orderedPositionIds.includes(id);

    if (isMissingFromLayer) {
      layer.orderedPositionIds.push(id);
      isModified = true;
    }
  });

  return isModified;
}

/**
 * Returns null if no modifications needed to be made, or the modified entities state if updates were made
 * @param rootStore
 * @returns {*|null}
 */
export function checkEntitiesIntegrity(rootStore) {
  const allEntities = rootStore.modules.entities().$state;

  // Delete any entity that doesn't have an id property as
  // a result of transact failing when creating entities
  let isModified = deleteEntitiesWithNoId(allEntities);

  if (allEntities.layers && allEntities.positions) {
    const hasRemovedObsoletePositions = checkLayerForObsoletePositions(allEntities);
    const hasModifiedOrphanedPositions = addOrphanedPositionsToLayer(allEntities);

    if (!isModified) isModified = hasRemovedObsoletePositions || hasModifiedOrphanedPositions;
  }

  return isModified ? allEntities : null;
}
