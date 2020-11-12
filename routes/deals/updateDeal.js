const {Router}    = require('express')
const router      = Router()
const MDeal       = require('../../models/MDeal')

router.post('/updateDeal', async (req, res) => {
  try {
    const { id, status } = req.body

    await MDeal.updateOne(
      { _id: id }, 
      { $set : { status } }
    )

    res.status(200)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
