const {Router}    = require('express')
const router      = Router()
const MTrade      = require('../../models/MTrade')


router.post('/getLastPrice', async (req, res) => {
  try {
    let {type} = req.body
    console.log("🚀 ~ file: getLastPrice.js ~ line 8 ~ router.post ~ type", type)
    const priceObject = await MTrade.find({base: type}).limit(1).sort({$natural:-1})
    console.log("🚀 ~ file: getLastPrice.js ~ line 10 ~ router.post ~ priceObject", priceObject)
    res.status(200).json(priceObject)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router