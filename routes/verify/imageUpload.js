const {Router}            = require('express')
const router              = Router()
const multer              = require('multer')
const aws                 = require("aws-sdk");
const multerS3            = require("multer-s3");



router.post('/uploadImage', async (req, res) => { 
  const s3 = new aws.S3();

  aws.config.update({
    secretAccessKey: process.env.S3_SECRET_AMAZON_ID,
    accessKeyId: process.env.S3_AMAZON_ID,
    region: "us-east-2",
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
  };
  
  
  const upload = multer({
    fileFilter,
    storage: multerS3({
      acl: "public-read",
      s3,
      bucket: 'verification-request-basket',
      metadata: function (req, file, cb) {
        cb(null, { type: file.mimetype });
      },
      key: function (req, file, cb) {
        cb(null,  file.originalname);
      },
    }),
  });

  const sUpload = upload.single('image')
     
  sUpload(req, res, (err) => {
    if (err) {
      console.log('err', err)
    }
    else {
      res.json({link: `https://verification-request-basket.s3.us-east-2.amazonaws.com/${req.body.name}`})
    }
  })
})

module.exports = router