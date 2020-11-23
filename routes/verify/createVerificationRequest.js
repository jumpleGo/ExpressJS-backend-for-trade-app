const {Router}            = require('express')
const router              = Router()
const MVerifyRequest      = require('../../models/MVerifyRequest')
const MImage              = require('../../models/MImage')
const multer              = require('multer')
const path                = require('path')
const UPLOAD_PATH         = path.resolve(__dirname, 'path/to/uploadedFiles')

const upload = multer({
  dest: UPLOAD_PATH,
  limits: {fileSize: 1000000, files: 3}
})

router.post('/createVerificationRequest', async (req, res) => {
  try {
    const {
      phone,
      address,
      fullName,
      birthdate,
      files,
      user
    } = req.body
    console.log(req.body)

    let imageFiles = []
    

    files.forEach(async file => {
      const image = new MImage(file.blob)
      const savedImage = await image.save()
      imageFiles.push(savedImage._id)
    })

    console.log("🚀 ~ file: createVerificationRequest.js ~ line 27 ~ imageFiles", imageFiles)

    const verifyRequest = new MVerifyRequest({
      phone,
      address,
      fullName,
      birthdate,
      files: imageFiles,
      user
    })
    
    const savedRequest = await verifyRequest.save()
    res.json(savedRequest)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
