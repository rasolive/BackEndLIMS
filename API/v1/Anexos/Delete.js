
// Move to quarentena
require('dotenv').config()
const { Storage } = require('@google-cloud/storage');

exports.deleteFile = async (req, res, next) => {

    const fileName= req.body.fileName
    console.log(fileName)
  
    try{         
        const bucketName = process.env.GCP_BUCKET_NAME;
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID || '',
            credentials: JSON.parse(process.env.GCP_CONFIG_PATH), 
        });        
            
        const response = await storage.bucket(bucketName).file(fileName).move(`quarentena/${fileName}`);

        console.log(`gs://${bucketName}/${fileName} deleted`);

        return res.send(`${fileName} deleted`)
        
    } catch (err) {
       
        next({ status: 400, message: 'Bad request' })
}
}



//                DELETE


// require('dotenv').config()
// const { Storage } = require('@google-cloud/storage');

// exports.deleteFile = async (req, res, next) => {

//     const fileName= req.body.fileName
//     console.log(fileName)
  
//     try{         
//         const bucketName = process.env.GCP_BUCKET_NAME;
//         const storage = new Storage({
//             projectId: process.env.GCP_PROJECT_ID || '',
//             credentials: JSON.parse(process.env.GCP_CONFIG_PATH), 
//         });        
            
//         const response = await storage.bucket(bucketName).file(fileName).delete();

//         console.log(`gs://${bucketName}/${fileName} deleted`);

//         return res.send(`${fileName} deleted`)
        
//     } catch (err) {
       
//         next({ status: 400, message: 'Bad request' })
// }
// }