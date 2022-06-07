require('dotenv').config()
const { Storage } = require('@google-cloud/storage');

exports.download = async (req, res, next) => {

    if (!req.query.path) throw { status: 400, message: 'Bad request' }

    let pathCloud = req.query.path
    let fileName = req.query.fileName
    
   
    let fullName = pathCloud
 

    try {        
        const bucketName = process.env.GCP_BUCKET_NAME;
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID || '',
            credentials: JSON.parse(process.env.GCP_CONFIG_PATH), 
        });        
        const nameFileOfDB = fullName.includes('_') ? fullName.slice(fullName.indexOf('_') + 1) : fullName
        
        const stream = await storage.bucket(bucketName).file(pathCloud).createReadStream();

        res.setHeader("content-type", "application/octet-stream");
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`)
        stream.on('error', (err) => {            
            next({ status: 400, message: 'Bad request' })            
        })
        stream.pipe(res)
        
        } catch (err) {
            console.log(err)
            next({ status: 400, message: 'Bad request' })
    }
}