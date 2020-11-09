const {Router}    = require('express') 
const router      = Router()
const keys        = require('./../../keys/keys.prod.js')
const jwt         = require('jsonwebtoken');
const bcrypt      = require('bcryptjs')
const MUser        = require('../../models/MUser')

router.post('/login',  async (req, res) => {
  try {
    const user = {
      user: req.body.email,
    }

    const candidate = await MUser.findOne({ email: req.body.email })
    
    console.log("candidate", candidate)
    if (candidate) {
      const areSame = await bcrypt.compare(req.body.password, candidate.password)

      if (areSame) {
        const token = jwt.sign(user, keys.JWT_SECRET, {
          expiresIn: '5d'
        })
    
        res.json({
          token,
          user: candidate
        })
      } else {
        res.json({
          error: 'wrong_pass'
        })
      }
    } else {
      res.status(400).json({ error: 'user-not-found'})
    }
    

  } catch (e) {
    console.log(e)
  } 
})

module.exports = router