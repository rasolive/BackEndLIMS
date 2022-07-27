require('dotenv').config()
const { Storage } = require('@google-cloud/storage');

exports.list = async (req, res, next) => {

  const path = req.body.gcpPatch

  try {
    const bucketName = process.env.GCP_BUCKET_NAME;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID || '',
      credentials: JSON.parse(process.env.GCP_CONFIG_PATH),
    });

    const [response] = await storage.bucket(bucketName).getFiles({ prefix: path });

    var files = response.map(function (node) {
      return {
        'name': node.name,
        'path': path,
      };
    })

    return res.json(files).end();

  } catch (err) {
    console.log(err)
    next({ status: 400, message: 'Bad request' })
  }
}
