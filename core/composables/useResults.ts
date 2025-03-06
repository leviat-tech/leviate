import {useApiGateway} from "./useApiGateway";
import {useHost} from "../plugins/host";


async function getStoragePath(positionId: string): Promise<string> {
  const designData = await useHost().getConfiguration();
  const designId = designData.id;

  return `/${designId}/${positionId}`;
}

export default function useResults(appName: string) {

  const storageApi = useApiGateway(`fupload/${appName}-results`);

  let errorCallback: (error: Error) => void | undefined;

  function handleStorageApiError(error: Error) {
    if (errorCallback) {
      errorCallback(error);
    } else {
      console.log(error);
    }
  }

  return {
    onError(callback: (error: Error) => void) {
      errorCallback = callback;
    },

    async getResults(positionId: string) {
      const storagePath = await getStoragePath(positionId);
      return storageApi.get(storagePath).catch(handleStorageApiError);
    },

    async uploadResults(positionId: string, results: any): Promise<any> {
      const formdata = new FormData();
      const json = JSON.stringify(results);
      const blob = new Blob([json], { type: 'application/json' });
      const file = new File([blob], 'positionId');
      formdata.append('file', file);

      const storagePath = await getStoragePath(positionId);

      return storageApi.post(storagePath, formdata).catch(handleStorageApiError);
    },

    async deleteResults(positionId: string) {
      const storagePath = await getStoragePath(positionId);
      return storageApi.delete(storagePath).catch(handleStorageApiError);
    }
  }
}
