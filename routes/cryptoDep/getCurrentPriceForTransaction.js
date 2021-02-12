const BlockIo = require('block_io');
const BTC = new BlockIo('d493-a5e8-4d7b-e422')
const DOGE = new BlockIo('c58c-7c75-ef4c-5485')
const LTC = new BlockIo('a203-0b89-cfb6-1433')

// TEST
// const BTC = new BlockIo('9d66-8655-0720-a6e7')
// const DOGE = new BlockIo('3483-9bfc-ec7b-1da4')
// const LTC = new BlockIo('156c-802d-5574-9af6')
const {Router}    = require('express')
const router      = Router()

router.post('/getCurrentPriceForTransaction', async (req, res) => {
  const {type } = req.body

  try {
    const data = await eval(type).get_current_price({ price_base: 'USD' });
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
  }


})

module.exports = router
