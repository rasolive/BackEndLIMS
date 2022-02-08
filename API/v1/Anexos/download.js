require('dotenv').config()
const { Storage } = require('@google-cloud/storage');

exports.download = async (req, res, next) => {

  
    try {        
        const bucketName = process.env.GCP_BUCKET_NAME;
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID || '',
            credentials: JSON.parse(process.env.GCP_CONFIG_PATH), 
        });        
        // const nameFileOfDB = fullName.includes('_') ? fullName.slice(fullName.indexOf('_') + 1) : fullName
        
        const stream = await storage.bucket(bucketName).file("final/teste/anexos/extras/2022-02-08T08-52-57_Certificado_Nacional_de_Covid-19.pdf").createReadStream();

        res.setHeader("content-type", "application/octet-stream");
        res.setHeader('Content-disposition', `attachment; filename= ${nameFileOfDB }`)
        stream.on('error', (err) => {            
            next({ status: 400, message: 'Bad request' })            
        })
        stream.pipe(res)
        
        } catch (err) {
            console.log(err)
            next({ status: 400, message: 'Bad request' })
    }
}