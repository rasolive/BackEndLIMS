require('dotenv').config()
const { Storage } = require('@google-cloud/storage');

exports.download = async (req, res, next) => {

    if (!req.query.path) throw { status: 400, message: 'Bad request' }

    let pathCloud = req.query.path
    
    while(pathCloud.includes('%20')) {
        pathCloud = pathCloud.replace('%20',' ')
    }
    while(pathCloud.includes('%C3%B5')) {
        pathCloud = pathCloud.replace('%C3%B5','õ')
    }
    
    pathCloud = pathCloud.includes('/') ? pathCloud.split('/') : [pathCloud]
    let fullName = pathCloud.pop()
    pathCloud.push(fullName)
    pathCloud = pathCloud.join('/')    

    try {        
        const bucketName = process.env.GCP_BUCKET_NAME;
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID || '',
            credentials: JSON.parse(process.env.GCP_CONFIG_PATH), 
        });        
        const nameFileOfDB = fullName.includes('_') ? fullName.slice(fullName.indexOf('_') + 1) : fullName
        
        const stream = await storage.bucket(bucketName).file(pathCloud).createReadStream();

        res.setHeader("content-type", "application/octet-stream");
        res.setHeader('Content-disposition', `attachment; filename=${nameFileOfDB}`)
        stream.on('error', (err) => {            
            next({ status: 400, message: 'Bad request' })            
        })
        stream.pipe(res)
        
        } catch (err) {
            console.log(err)
            next({ status: 400, message: 'Bad request' })
    }
}