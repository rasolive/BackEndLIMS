const { Storage } = require('@google-cloud/storage');
const moment = require('moment')
const axios = require('axios');
require('dotenv').config()

var multer = require('multer');
var upload = multer();

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || '',
  credentials: JSON.parse(process.env.GCP_CONFIG_PATH),
});

const UPLOAD_MAX_SIZE = process.env.GCP_UPLOAD_MAX_SIZE * 1024 * 1024;

const MB = 5;
const propsToCreateBlacklist = {
  group: "workflow",
  label: 'WAIT FOR LABEL',
  extBlackList: ["exe", "bat"],
  maxSize: (MB * 1024 * 1024),
}

module.exports.post = async (req, res, next) => {
  upload.array()

  try {
    const { files } = req.files.length ? req : req.body;
    if (!files || files.length === 0) throw { status: 400, message: "Bad Request" };

    const archiveFullData = req.body.archiveFullData ? JSON.parse(req.body.archiveFullData) : null
    if (!Boolean(archiveFullData)) throw { status: 400, message: "Bad Request" }

    const metadata = getMetaData(files)
    let basePath = await getBasePath(archiveFullData)

    Object.assign(metadata, { basePath });

    Object.assign(archiveFullData, { metadata });

    // •••••••••• ---------- Blacklists ---------- •••••••••• //
    Object.assign(propsToCreateBlacklist, { label: archiveFullData.metadata.basePath });

    const uploadFileResult = await tryUploadFileToStorage(files, archiveFullData); // « TO DO: add timestamp at send files

    if (!Boolean(uploadFileResult)) {
      throw { status: 500, message: "internal server error" };
    }

    const inserted = "ok"
    if (!inserted || inserted.status >= 400) throw inserted;

    return res.send(inserted)
  } catch (err) {
    console.error(err);
    next(err);
  }

};

// •••••••••• ---------- getMetaData ---------- •••••••••• //
const getMetaData = (files) => {
  const metadata = {};

  Object.assign(metadata, files[0]);
  delete metadata.buffer;

  const time = moment().format('YYYY-MM-DD[T]HH-mm-ss')
  Object.assign(metadata, { time });

  let handleOriginalname = metadata.originalname;
  handleOriginalname = handleOriginalname.includes('.')
    ? handleOriginalname.split('.') : handleOriginalname;

  let ext = null;
  let shortName = null;

  if (Array.isArray(handleOriginalname)) {
    ext = handleOriginalname.pop();
    shortName = handleOriginalname.join('.');
    Object.assign(metadata, { ext, shortName });
  }
  return metadata
}

// •••••••••• ---------- getFileURI ---------- •••••••••• //
const getFileURI = (basePath = '') => {
  if (Boolean(basePath)) return basePath
};

// •••••••••• ---------- getBasePath ---------- •••••••••• //
const getBasePath = async (archiveFullData) => {

  if (!archiveFullData) return '';

  const path = archiveFullData.path || null

  let basePath = getFileURI(path);

  if (path) {
    archiveFullData.folder = path.includes('/') ? path.split('/') : [path]
    return path;
  }

  if (archiveFullData.folder.length > 1) {
    const concatFolders = archiveFullData.folder.filter((item, index) => {
      if (index > 1) return item
      if (index <= 1 && item !== equipamentName && item !== projectName) {
        return item
      }
    });

    if (concatFolders.length > 0) {
      return basePath.concat('/', concatFolders.join('/'));
    }
  }

  return basePath;
}

// •••••••••• ---------- sendFileToStorage ---------- •••••••••• //
const sendFileToStorage = async (
  file,
  path,
  metadata,
  bucketName = process.env.GCP_BUCKET_NAME
) => {
  try {
    // Implement file upload to storage
    const time = metadata.time;
    const bucket = storage.bucket(bucketName);
    const finalPathName = `${(path ? path + '/' : '')}${file.originalname}`;
    const blob = bucket.file(`${finalPathName}`);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    const blobReturn = new Promise((resolve, reject) => {
      blobStream
        .on('finish', () => {
          resolve(`finish ${finalPathName}`);
        })
        .on('error', (err) => {
          reject({ status: 400, message: "Bad request " });
        })
        .end(file.buffer); // Confirm if the actual file data is stored in the file's buffer parameter
    })
    return blobReturn
  } catch (err) {
    return err
  }
};

// •••••••••• ---------- tryUploadFileToStorage ---------- •••••••••• //
const tryUploadFileToStorage = async (files, archiveFullData) => {
  try {
    if (!Boolean(files) || !Boolean(archiveFullData)) {
      return { status: 400, message: "Bad request" };
    }
    const basePath = archiveFullData.metadata.basePath

    let filesToUpload = [];
    for (const file of files) {
      if (file.size > UPLOAD_MAX_SIZE)
        throw {
          status: 413,
          message: `The files must not exceed ${UPLOAD_MAX_SIZE / 1000000}MB`,
        };

      filesToUpload.push({
        file,
        URI: getFileURI(basePath),
      });
    }

    if (!Boolean(filesToUpload) || !Boolean(filesToUpload.length)) {
      throw { status: 400, message: "Bad request" };
    }

    return await Promise.all(
      filesToUpload.map(async (item) => {
        try {
          const resultStorage = await sendFileToStorage(item.file, item.URI, archiveFullData.metadata)

          if (!Boolean(resultStorage)) {
            throw { status: 500, message: "internal server error" };
          }

          return resultStorage;
        } catch (err) {
          return { status: 500, message: "internal server error" };
        }
      })
    );
  } catch (err) {
    return err
  }

}

