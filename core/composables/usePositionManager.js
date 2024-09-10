import { useRouter } from 'vue-router';
import { useEntity } from './useEntity';

export function usePositionManager(positionModel, layerModel) {
  const router = useRouter();

  function deletePosition(position) {
    const entity = useEntity(positionModel);

    positionModel.find(position.id).$delete();

    if (!positionModel.find(position.id)) {
      const activeLayer = layerModel.find(position.layerId);

      const nextLogicalPosition = positionModel
        .read()
        .find((pos) => activeLayer.orderedPositionIds.includes(pos.id) && pos.id !== position.id);

      if (!nextLogicalPosition) {
        entity.value = null;
      } else {
        entity.value = positionModel.find(nextLogicalPosition.id);
      }
      router.push(
        nextLogicalPosition ? `/entities/positions/${nextLogicalPosition.id}` : { name: 'home' }
      );
    }
  }

  return { deletePosition };
}
