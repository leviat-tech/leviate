import { ref } from 'vue';
import { useApiGateway } from './useApiGateway';
import { useFile } from './useFile';

/**
 * @param { boolean } [download] - download the file to the user's computer
 * @param { boolean } [open] - open the file in a new window
 * @return {{
 *     generatePdf(object, {
 *     filename: string,
 *     appendDate?: boolean,
 *     servicePath?: string
 *     }): Promise<boolean>, isGenerating: Ref<boolean>
 *   }}
 */
export function usePdfGenerator({ open = false, download = true }) {
  const isGenerating = ref(false);

  return {
    isGenerating,

    /**
     * @typedef DownloadPDFOptions
     * @param { string | function } [filename] - required if download enabled
     * @param { boolean } [appendDate] - append today's date to the filename
     * @param { string } [servicePath] - the service endpoint if not using the default pdf service
     *
     * @param { object } doc - the pdfmake document definition
     * @param { DownloadPDFOptions } [options]
     * @return {Promise<boolean>}
     */
    async generatePdf(doc, options = {}) {
      isGenerating.value = true;

      const { filename, appendDate = false, servicePath = 'pdf' } = options;
      const api = useApiGateway(servicePath);
      const content = await api.post({ doc }, { responseType: 'blob' });

      isGenerating.value = false;

      if (!content) throw new Error('No content provided');
      return useFile('pdf', content, { filename, appendDate, download, open });
    }
  }
}
