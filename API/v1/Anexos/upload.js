const { Storage } = require('@google-cloud/storage');
//const { WorkflowArchive } = require('./model')
//const { makeTreeUri } = require('./tree')
const moment = require('moment')
//const { axios, geralConfigDB } = require('../../../Globals/axiosConfig')
const axios = require('axios');

/**@todo: create route and search for Equipaments with axios in general-config-db */
/**@todo: implement search with axios and remove model 'Equipaments' */
// const Project = require('../Projects/model')
// const Equipaments = require('../Equipments/model')

require('dotenv').config()

var multer = require('multer');
var upload = multer();

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || '',
  credentials: JSON.parse(process.env.GCP_CONFIG_PATH), 
});

const UPLOAD_MAX_SIZE = process.env.GCP_UPLOAD_MAX_SIZE * 1000000;

const MB = 90;
const propsToCreateBlacklist = {
  group: "workflow",
  label: 'WAIT FOR LABEL',
  extBlackList: ["exe","bat"],
  maxSize: (MB * 1024),
}

const checkEquipmentExists = (archiveFullData) => {
  if (archiveFullData.equipament) return archiveFullData.equipament

  if (archiveFullData.path.includes('/')) {
    const basePathSplit = archiveFullData.path.split('/');
    return basePathSplit.length > 1 ? basePathSplit[1] : null
  }      
}

module.exports.post = async (req, res, next) => {
  upload.array()

  try {
    //const { session } = res;
   // const AUTH_TOKEN = req.query.token
   	const { Hostname } = req.body;
    //const { user, accessLevel } = session;
    const { files } = req.files.length ? req : req.body;

    //if (!AUTH_TOKEN) throw { status: 401, message: "Unauthorized" };
    if (!files || files.length === 0) throw { status: 400, message: "Bad Request" };

    const archiveFullData = req.body.archiveFullData ? JSON.parse(req.body.archiveFullData) : null
    if(!Boolean(archiveFullData)) throw { status: 400, message: "Bad Request" }

    const metadata = getMetaData(files)
    let basePath = await getBasePath(archiveFullData)

    Object.assign(metadata, { hostname: Hostname });
    Object.assign(metadata, { basePath });       
    Object.assign(archiveFullData, { equipament: checkEquipmentExists(archiveFullData) || null });
    Object.assign(archiveFullData, { metadata });
    
    // •••••••••• ---------- Blacklists ---------- •••••••••• //
    Object.assign(propsToCreateBlacklist, { label: archiveFullData.metadata.basePath });
    const tryCreateBlacklist = await postWorkflowsBlackLists(propsToCreateBlacklist)

    // const Blacklists = await getWorkflowsBlackLists(archiveFullData.metadata.basePath)
    // if (!Blacklists || !Blacklists.data || Blacklists.status >= 400) {
    //   throw { status: 401, message: `Unauthorized1 - ${Blacklists.data ? Blacklists.data : null}` }
    // }

    //const { extBlackList, maxSize } = Blacklists.data
    //const isBlacklist = extBlackList.includes(archiveFullData.metadata.ext)
    //const isMaxSize = archiveFullData.metadata.size > maxSize

    //if (isBlacklist) throw { status: 401, message: "Unauthorized2 -  - isBlacklist - file extension not allowed" }    
    //if (isMaxSize) throw { status: 401, message: "Unauthorized3 - isMaxSize - file size not allowed" }
    // •••••••••• ---------- ••••• ---------- •••••••••• //

    const uploadFileResult = await tryUploadFileToStorage(files, archiveFullData); // « TO DO: add timestamp at send files
    const environment = Hostname === 'frontend' ? 'final' : 'staging'

    if(!Boolean(uploadFileResult)) {
      throw { status: 500, message: "internal server error" };
    }    
    
    // const inserted = await tryInsertInWorkflowArchive("user", archiveFullData, [environment])
    // if (!inserted || inserted.status >= 400) throw inserted;

    // const Tree = await makeTreeUri(inserted.message, session.user, environment)
    // if (!Tree || Tree.status >= 400) throw Tree;
    
    // return res.send(inserted)
  } catch (err) {
    console.error(err);
    next(err);
  }

};

// •••••••••• ---------- getWorkflowsBlackLists ---------- •••••••••• //
/**@todo criar e aplicar na pasta requests */
const getWorkflowsBlackLists = async (basePath, AUTH_TOKEN) => {            
  try {
    const returnList = await geralConfigDB({
      method: 'get',
      url: `/blackLists?token=${AUTH_TOKEN}&group=workflow&label=${basePath}`,          
    });

    if (!returnList.data) throw { status: 401, message: "Unauthorized4 - The list of allowed extensions was not found." }
     return returnList
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Axios error:',axios.isAxiosError(err),err.response.data);
      return err.response;
    }
    return err
  }
}

// •••••••••• ---------- postWorkflowsBlackLists ---------- •••••••••• //
/**@todo criar e aplicar na pasta requests */
const postWorkflowsBlackLists = async (props, AUTH_TOKEN) => {            
  try {    

    const returnList = await geralConfigDB({
        method: 'POST',
        url: `/blackLists?token=${AUTH_TOKEN}`,        
        data: props
    });

    if (!returnList.data) throw { status: 401, message: "Unauthorized5 - The list of allowed extensions was not found." }
     return returnList
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Axios error:',axios.isAxiosError(err));
      return err.response;
    }
    return err
  }
}

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
const getFileURI = (basePath = '', projectName, equipamentName) => {  
  if (Boolean(basePath)) return basePath 
  return Boolean(equipamentName) ? `${projectName}/${equipamentName}` : projectName    
};

// •••••••••• ---------- getBasePath ---------- •••••••••• //
const getBasePath = async (archiveFullData) => {

  if (!archiveFullData) return '';
   
  const projectName = archiveFullData.project;
  const equipamentName = archiveFullData.equipament || checkEquipmentExists(archiveFullData) || null;
  const path = archiveFullData.path || null
  
  let basePath = getFileURI(path, projectName, equipamentName);
  
  if (path) {
    archiveFullData.folder = path.includes('/') ? path.split('/') : [path]
    return path;
  }

  if (archiveFullData.folder.length > 1) {
    const concatFolders = archiveFullData.folder.filter( (item,index) => {
      if (index > 1) return item
      if ( index <= 1 && item !== equipamentName && item !== projectName){
        return item
      }
    });    
    
    if (concatFolders.length > 0) {
      return basePath.concat('/',concatFolders.join('/'));            
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
    // const finalPathName = `${(path ? path +'/': '')}${time}_${file.originalname.replace(/ /g, '_')}`;
    const finalPathName = `${(path ? path +'/': '')}${time}_${file.originalname}`;
    // const blob = bucket.file(finalPathName);

    const environment = metadata.hostname === 'frontend' ? 'final' : 'staging'
    const blob = bucket.file(`${environment}/${finalPathName}`);
    // const blob = bucket.file(`${finalPathName}`);
    
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
const tryUploadFileToStorage = async (files,archiveFullData) => {  
  try {
  if(!Boolean(files) || !Boolean(archiveFullData)) {
    return { status: 400, message: "Bad request" };
  }

  const equipamentName = archiveFullData.equipament;
  const projectName = archiveFullData.project;
  const basePath =  archiveFullData.metadata.basePath

  let filesToUpload = [];
    for (const file of files) {
      if (file.size > UPLOAD_MAX_SIZE)
      throw {
        status: 413,
        message: `The files must not exceed ${UPLOAD_MAX_SIZE / 1000000}MB`,
      };

      filesToUpload.push({
        file,
        URI: getFileURI(basePath, projectName, equipamentName),
      });
    }

  if(!Boolean(filesToUpload) || !Boolean(filesToUpload.length)) {
    throw { status: 400, message: "Bad request" };
  }

  return await Promise.all(
    filesToUpload.map( async (item) => {
      try {
        const resultStorage = await sendFileToStorage(item.file, item.URI, archiveFullData.metadata)
        // console.log('resultStorage',resultStorage);        
        
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

// •••••••••• ---------- tryInsertInWorkflowArchive ---------- •••••••••• //
const tryInsertInWorkflowArchive = async (user, archiveFullData, environment = ['staging']) => {
  
  if(!user || !archiveFullData) {
    return { status: 400, message: "Bad Request" };
  }
  
  const projectName = archiveFullData.project;
  const equipamentName = archiveFullData.equipament || null;
  const metadata =  archiveFullData.metadata
  const hostname = archiveFullData.metadata.hostname
  const basePath =  archiveFullData.metadata.basePath
  const time = metadata.time;
  
  delete archiveFullData.metadata.basePath  
  delete archiveFullData.metadata.hostname
  
  /**@todo: create route and search for Equipaments and Projects with axios in general-config-db */
  /**@todo: implement search with axios and remove model 'Equipaments' and 'Projects' */
  const resultProjectSearch =  await Project.findOne( "projectName" ,{ _id: 1 });
  const resultEquipamentsSearch =  equipamentName ? await Equipaments.findOne({ nameEquipment: equipamentName },{ _id: 1 }) : null
  
  const lastRow = await WorkflowArchive.findOne().sort({ _id: -1 });
  const _id = lastRow ? lastRow._id + 1 : 1;

  const workflowArchive = new WorkflowArchive({
    _id,
    active: true,
    environment, // « Recursividade
    project: projectName,
    projectId: resultProjectSearch ? resultProjectSearch._id : null,
    equipament: equipamentName || null,
    equipamentId: resultEquipamentsSearch ? resultEquipamentsSearch.id : null,
    hostname: hostname,
    URI: basePath,
    fullName: `${time}_${metadata.originalname}`,
    metadata,
    createdBy: user,
    updatedBy: user,
  });
  try {    
    const result = await workflowArchive.save();    
    
    if (result && result._id) {
      const completeURI = `${result.URI}/${result.fullName}`
      return { status: 200, message: completeURI };
    } else {
      return { status: 500, message: `A:: ${err.message}` }
    }
  } catch (err) {
    if(err.message.includes('E11000')) /* dup key */ {
      console.error('\ntry again: '+metadata.originalname);
      return await tryInsertInWorkflowArchive(user, archiveFullData, environment)
      
    }
    return { status: 500, message: `B:: ${err.message}` }
  }
}
