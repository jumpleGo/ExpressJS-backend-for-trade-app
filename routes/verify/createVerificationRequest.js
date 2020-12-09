const {Router}            = require('express')
const router              = Router()
const MVerifyRequest      = require('../../models/MVerifyRequest')


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
    console.log(files, req.body)
    

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

module.exports = router
