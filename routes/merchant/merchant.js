const {Router}    = require('express') 
const router      = Router()
const MUser       = require('../../models/MUser')
const MPromoCode  = require('../../models/MPromoCode')
const MDeposit  = require('../../models/MDeposit')
const multer      = require('multer');
const upload      = multer();
const MReferralConnection   = require('../../models/MReferralConnection')
const MPartner    = require('../../models/MPartner')

router.post('/merchant', upload.none(), async (req, res) => {
  try {
    const { payment_info, amount, obmen_order_id, obmen_timestamp } = req.body
    let partnerEaring = 0
    let promoAmount = null
    const payment_info_data = payment_info.split(';')
     
    if (payment_info && amount) {
      res.status(200).send('*ok*')
      //CHECK FOR PROMOCODE
      if (payment_info_data[1].length) {
        const promo = await MPromoCode.findOne({code: payment_info_data[1]})
        if (promo.minDeposit) {
          promoAmount = +amount + +promo.bonus 
        } else {
          let percent = +amount * +promo.bonus / 100
          promoAmount += percent
        }
      }

      // UPDATE USERS BALANCE
      const candidate = await MUser.findOne({ _id: payment_info_data[0] })
      let balance = promoAmount ? +candidate.balance + promoAmount : +candidate.balance + +amount
      balance.toFixed(2)
      await MUser.updateOne(
        { _id: payment_info_data[0] }, 
        { $set : { balance } }
      )
      if (candidate.demoBalance > 0) {
        await MUser.updateOne(
          { _id: payment_info_data[0] }, 
          { $set : { demoBalance: 0 } }
        )
      }

      //CHECK FOR REFERRAL
      const meReferral = await MReferralConnection.findOne({referral: payment_info_data[0]})
      if (meReferral) {
        const partner = await MPartner.findOne({user: meReferral.main})
        const { percent, user } = partner
        let partnerUser = await MUser.findOne({_id: user})
        partnerEaring = +amount * +percent / 100
        partnerUser.balance = partnerUser.balance + partnerEaring
        await MUser.updateOne(
          { _id: user }, 
          { $set : { balance: +partnerUser.balance.toFixed(2) } }
        )
      }

      // CREATE DEPOSIT
      const deposit = new MDeposit({
        timestamp: obmen_timestamp,
        orderId: obmen_order_id,
        amount: amount,
        user: payment_info_data[0],
        created_at: new Date(),
        partnerEaring: partnerEaring,
        promocode: payment_info_data[1]
      })
      await deposit.save()
      res.status(200)  
    }
    
  } catch (e) {
    console.log(e)
  } 
})

module.exports = router