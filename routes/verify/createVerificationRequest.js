const {Router}            = require('express')
const router              = Router()
const MVerifyRequest      = require('../../models/MVerifyRequest')
const MImage              = require('../../models/MImage')
const multer              = require('multer')


// const storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     callback(null, '/images');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.name);
//   }
// });
// const upload = multer({dest: 'uploads/'});

// router.post("/createVerificationRequest", parser.single("image"), (req,res)=>{
//   console.log(req.body) // to see what is returned to you
//   const image = {};
//   image.url = req.file.url;
//   image.id = req.file.public_id;
//   Image.create(image) // save image information in database
//     .then(newImage => res.json(newImage))
//     .catch(err => console.log(err));
// })

router.post('/createVerificationRequest', async (req, res) => {
  try {
    const {
      phone,
      address,
      fullName,
      birthdate,
      files,
      user,
      status
    } = req.body
    console.log(req.body)

    // let imageFiles = []
    

    // files.forEach(async file => {
    //   const image = new MImage(file.blob)
    //   const savedImage = await image.save()
    //   imageFiles.push(savedImage._id)
    // })

    const verifyRequest = new MVerifyRequest({
      phone,
      address,
      fullName,
      birthdate,
      files,
      user,
      status
    })
    
    const savedRequest = await verifyRequest.save()
    res.json(savedRequest)
  } catch (err) {
    res.status(400).json(err)
  }
})

// function uploadImage (file) {
//   app.post('/', upload.single('file'), (req, res) => {
//     if (!req.file) {
//       console.log("No file received");
//       return res.send({
//         success: false
//       });
  
//     } else {
//       console.log('file received');
//       return res.send({
//         success: true
//       })
//     }
//   });
// }

module.exports = router
