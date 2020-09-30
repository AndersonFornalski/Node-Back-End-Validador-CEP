const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require("../../dataBase/url");
 
aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    region: config.S3_REGION
})

const s3 = new aws.S3();

const fileFilter = (req, file, cb) =>{
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
    cb(null, true);
  } else{
    cb(new Error("Tipo inválido, apenas JPEG e PNG é aceito! "), false);
  }
}
 
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "testing_metadada"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
 
module.exports = upload;