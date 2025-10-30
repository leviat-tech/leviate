import { useApiGateway } from "./useApiGateway";
import { useHost } from "../plugins/host";
import { reactive } from 'vue';

type EntityItemResults = Record<string, never>;

interface EntityResults {
  [entityId: string]: EntityItemResults;
}

const entityResults = reactive<EntityResults>({});

let api;

function getStorageApi() {
  if (api) {
    return api;
  }

  const { referenceName } = useHost().meta.configurator;

  if (!referenceName) {
    throw new Error('Could not retrieve referenceName from host.meta.configurator');
  }

  api = useApiGateway(`fupload/${referenceName}-results`);

  return api;
}

async function getStoragePath(
  entityId: string,
  params: { [param: string]: string } | null = { presign: '1' },
): Promise<string> {
  const designData = await useHost().getConfiguration();
  const designId = designData.id;

  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `/${designId}/${entityId}${queryString}`;
}

export default function useResults() {
  let errorCallback: (error: Error) => void | undefined;

  function handleStorageApiError(error: Error) {
    if (errorCallback) {
      errorCallback(error);
    } else {
      console.log(error);
    }
  }

  return {
    entityResults,

    onResultsError(callback: (error: Error) => void) {
      errorCallback = callback;
    },

    /**
     * Fetch an entity's results from s3 and save in local store
     * @param entityId
     */
    async getResults(entityId: string) {
      const storagePath = await getStoragePath(entityId);
      const presignedDownloadUrl = await getStorageApi().get(storagePath);

      try {
        const results = await fetch(presignedDownloadUrl).then(res => res.json());
        entityResults[entityId] = results;
        return results;
      } catch (e) {
        console.warn(`Could not find results for entity id ${entityId}. Error: ${e}`);
        return null;
      }
    },

    /**
     * Upload an entity's results to s3 and save in local store
     * @param entityId
     * @param results
     */
    async uploadResults(entityId: string, results: EntityItemResults): Promise<Response | void> {
      entityResults[entityId] = results;

      const storagePath = await getStoragePath(entityId);
      const presignedUploadUrl = await getStorageApi().put(storagePath);
      const json = JSON.stringify(results);
      const blob = new Blob([json], { type: 'application/json' });
      const file = new File([blob], 'entityId');

      return fetch(presignedUploadUrl, {
        method: 'PUT',
        body: file,
      }).catch(handleStorageApiError);
    },

    /**
     * Delete an entity's results from internal store and s3 bucket
     * @param entityId
     */
    async deleteResults(entityId: string) {
      delete entityResults[entityId];
      const storagePath = await getStoragePath(entityId, null);
      return getStorageApi().delete(storagePath).catch(handleStorageApiError);
    },
  };
}
