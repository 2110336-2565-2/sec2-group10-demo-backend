import { BadRequestException } from '@nestjs/common';

export const uploadMusicImageFilter = (req, file, callback) => {
  // check if file format is correct
  return file &&
    file.mimetype &&
    file.mimetype.match(/(audio|image)\/(mpeg|mp3|wav|jpg|jpeg|png)$/)
    ? callback(null, true)
    : callback(
        new BadRequestException('Only audio and image file are allowed'),
        false,
      );
};

export const uploadFileName = (req, file, callback) => {
  const fileNameSplit = file.originalname.split('.');
  const fileExt = fileNameSplit[fileNameSplit.length - 1];
  callback(null, `${req.query.documentType}/${Date.now()}.${fileExt}`);
};

export const uploadLimits = {
  // fileSize default = 30 MB
  fileSize: Number.isNaN(
    Number(process.env.CLOUD_STORAGE_USER_MUSIC_LIMIT_SIZE),
  )
    ? 30 * 1024 * 1024
    : Number(process.env.CLOUD_STORAGE_USER_MUSIC_LIMIT_SIZE),
};

// export const deleteFileInStorage = async (url: string, keyword: string) => {
//   const filename = urlToFilename(url, keyword);
//   if (filename !== '') {
//     const storage = new Storage({
//       keyFilename: process.env.CLOUD_STORAGE_KEY_FILE_NAME,
//     });
//     await storage
//       .bucket(process.env.CLOUD_STORAGE_USER_DOCUMENT_BUCKET)
//       .file(filename)
//       .delete();
//   }
// };

// const urlToFilename = (url: string, keyword: string) => {
//   let idx = url.indexOf(keyword);
//   return idx >= 0 ? url.substring(idx) : '';
// };

const getCloudStorageCredentials = (base64: string | undefined): any => {
  if (base64) {
    const json = Buffer.from(base64, 'base64').toString('ascii');
    return JSON.parse(json);
  }
  return {};
};

const getStorageOptions = () => ({
  projectId: process.env.CLOUD_STORAGE_PROJECT_ID,
  bucket: process.env.CLOUD_STORAGE_USER_MUSIC_BUCKET,
  credentials: getCloudStorageCredentials(
    process.env.CLOUD_STORAGE_CREDENTIALS,
  ),
  filename: uploadFileName,
});

export const STORAGE_OPTIONS = getStorageOptions();
