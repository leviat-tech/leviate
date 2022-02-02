require('dotenv').config();
const s3FolderUpload = require('s3-folder-upload');


const directoryName = 'dist';
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
};

const options = {
  useFoldersForFileTypes: false,
};

s3FolderUpload(directoryName, credentials, options);
