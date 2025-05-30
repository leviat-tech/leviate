import { useApiGateway } from "./useApiGateway";
import { useHost } from "../plugins/host";
import { reactive } from "vue";

interface EntityResults {
  [entityId: string]: EntityItemResults;
}

interface EntityItemResults {}

const entityResults: EntityResults = reactive({});

let api;

function getStorageApi() {
  if (api) { return api }

  const { referenceName } = useHost().meta.configurator;

  if (!referenceName) {
    throw new Error('Could not retrieve referenceName from host.meta.configurator');
  }

  api = useApiGateway(`fupload/${referenceName}-results`);

  return api;
}

async function getStoragePath(entityId: string): Promise<string> {
  const designData = await useHost().getConfiguration();
  const designId = designData.id;

  return `/${designId}/${entityId}`;
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
      const results = await getStorageApi().get(storagePath).catch(handleStorageApiError);
      entityResults[entityId] = results;
      return results;
    },

    /**
     * Upload an entity's results to s3 and save in local store
     * @param entityId
     * @param results
     */
    async uploadResults(entityId: string, results: EntityItemResults): Promise<any> {
      entityResults[entityId] = results;

      const formdata = new FormData();
      const json = JSON.stringify(results);
      const blob = new Blob([json], { type: 'application/json' });
      const file = new File([blob], 'entityId');
      formdata.append('file', file);

      const storagePath = await getStoragePath(entityId);

      return getStorageApi().post(storagePath, formdata).catch(handleStorageApiError);
    },

    /**
     * Delete an entity's results from internal store and s3 bucket
     * @param entityId
     */
    async deleteResults(entityId: string) {
      delete entityResults[entityId];
      const storagePath = await getStoragePath(entityId);
      return getStorageApi().delete(storagePath).catch(handleStorageApiError);
    }
  }
}
