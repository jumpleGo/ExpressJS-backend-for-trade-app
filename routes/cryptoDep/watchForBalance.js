const BlockIo = require('block_io');
const BTC = new BlockIo('d493-a5e8-4d7b-e422')
const DOGE = new BlockIo('c58c-7c75-ef4c-5485')
const LTC = new BlockIo('a203-0b89-cfb6-1433')

// TEST
// const BTC_TEST = new BlockIo('9d66-8655-0720-a6e7')
// const DOGE_TEST = new BlockIo('3483-9bfc-ec7b-1da4')
// const LTC_TEST = new BlockIo('156c-802d-5574-9af6')

const {Router}    = require('express')
const router      = Router()

const MReferralConnection   = require('../../models/MReferralConnection')
const MPartner    = require('../../models/MPartner')
const MUser       = require('../../models/MUser')
const MPromoCode  = require('../../models/MPromoCode')
const MDeposit    = require('../../models/MDeposit')

router.post('/watchForBalance', async (req, res) => {
  const { address, amount, promocode, user, type, cryptoAmount } = req.body
  console.log("🚀 ~ file: watchForBalance.js ~ line 17 ~ router.post ~ { address, amount, promocode, user, type }", { address, amount, promocode, user, type })
  var timer = 0
  try {
    async function creadeDepositArticle(amount, cryptoAmount) {
      console.log("🚀 ~ file: watchForBalance.js ~ line 26 ~ creadeDepositArticle ~ amount, cryptoAmount", amount, cryptoAmount)
      let partnerEaring = 0
      let promoAmount = 0
      //CHECK FOR PROMOCODE
      if (promocode) {
        const promo = await MPromoCode.findOne({code: promocode})
        if (promo.minDeposit) {
          promoAmount = +amount + +promo.bonus 
        } else {
          let percent = +amount * +promo.bonus / 100
          promoAmount += percent
        }
      }
      // UPDATE USERS BALANCE
      const candidate = await MUser.findOne({ _id: user })
      let balance = promoAmount ? +candidate.balance + promoAmount : +candidate.balance + +amount
      balance.toFixed(4)
      await MUser.updateOne(
        { _id: user }, 
        { $set : { balance } }
      )
      if (candidate.demoBalance > 0) {
        await MUser.updateOne(
          { _id: user }, 
          { $set : { demoBalance: 0 } }
        )
      }

      //CHECK FOR REFERRAL
      const meReferral = await MReferralConnection.findOne({referral: user})
      if (meReferral) {
        const partner = await MPartner.findOne({user: meReferral.main})
        let { percent, user } = partner
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
        timestamp: Date.now() / 1000 | 0,
        type: type,
        amount: amount,
        user: user,
        created_at: new Date(),
        partnerEaring: partnerEaring,
        promocode: promocode,
        cryptoAmount: cryptoAmount
      })
      await deposit.save()
      res.status(200)  
    }

    const timeout = setInterval(async function () {
      timer++
      let balance

      try {
        balance = await eval(type).get_address_balance({ address })
      } catch (err) {
        console.log(err)
      }

      const { available_balance } = balance.data.balances[0]
      console.log("🚀 ~ file: watchForBalance.js ~ line 93 ~ timeout ~ available_balance", available_balance, cryptoAmount)

      if (+available_balance >= +cryptoAmount) {

        creadeDepositArticle(amount, cryptoAmount)
        clearTimeout(timeout)
      } else if (+available_balance < +cryptoAmount && +available_balance > 0) {
        console.log('small')
        let data
        try {
          data = await eval(type).get_current_price({ price_base: 'USD' })
        } catch (err) {
          console.log(err)
        }
        const  { price } = data.data.prices[0]

        let amountNew = +available_balance * +price
        creadeDepositArticle(amountNew, available_balance)
        clearTimeout(timeout)
      }

      if (timer === 120) {
        clearTimeout(timeout)
      }
    }, 10000)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
