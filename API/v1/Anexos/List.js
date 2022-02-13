require('dotenv').config()
const { Storage } = require('@google-cloud/storage');

exports.list = async (req, res, next) => {

    const path = req.body.gcpPatch
    // console.log(path)
  
    try {        
        const bucketName = process.env.GCP_BUCKET_NAME;
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID || '',
            credentials: JSON.parse(process.env.GCP_CONFIG_PATH), 
        });        
            
        const [files] = await storage.bucket(bucketName).getFiles({ prefix: path });
        // console.log(files)
        // console.log('Files:');
        // files.forEach(file => {
        // console.log(file.name);              
        // })
        files.forEach(file => {
            file.path = path              
            })

        return res.json(files).end();
        
        } catch (err) {
            console.log(err)
            next({ status: 400, message: 'Bad request' })
    }
}
