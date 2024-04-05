const extensionToMimeTypeMap = {
  csv: 'text/csv',
  dxf: 'image/x-dxf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  svg: 'image/svg+xml',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'text/xml',
  zip: 'application/zip',
};

const unknownExtensionMimeType = 'text/plain';

/**
 * @typedef FileOptions
 * @param { string | function } [filename] - if downloading, the name of the file (without extension) to be saved on the user's computer
 * A function returning a string may be passed for dynamically generating filenames.
 * @param { boolean } [appendDate] - append today's date to the filename
 * @param { boolean } [download] - download the file to the user's computer
 * @param { boolean } [open] - open the file in a new window
 *
 * Download or open a file
 * If a function is passed this will be called when download is initiated. This may be useful for dynamic filenames.
 * @param { string } extension - the file extension
 * @param { string } content - the text content of the file
 * @param { FileOptions } [options]
 * @return { boolean }
 */
export function useFile(extension, content, { filename, appendDate = false, download = true, open = false }) {
  if (!extension) throw new Error('No extension provided');
  if (!content) throw new Error('No content provided');

  const type = extensionToMimeTypeMap[extension] || unknownExtensionMimeType;
  const file = new Blob([content], { type });
  const fileUrl = URL.createObjectURL(file);

  if (open) {
    window.open(fileUrl, '_blank');
  }

  if (download) {
    downloadFile(fileUrl, filename, extension, content, appendDate);
  }

  return true;
}

function downloadFile(fileUrl, filename, extension, content, appendDate) {
  if (!filename) throw new Error('No filename provided');

  let generatedFilename = (typeof filename === 'function') ? filename() : filename;

  if (appendDate) {
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    generatedFilename += '_' + new Date().toLocaleDateString(null, dateOptions);
  }

  const link = document.createElement('a');

  // Ensure link is not visible, and does not shift the page content
  Object.assign(link.style, {
    position: 'absolute',
    zIndex: -1,
    width: 0,
    height: 0,
    opacity: 0,
  });

  document.body.appendChild(link);
  link.href = fileUrl;
  link.download = `${generatedFilename}.${extension}`;
  link.click();
}
