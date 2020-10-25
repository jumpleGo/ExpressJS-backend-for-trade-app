const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('wrongEmail')
    .trim(),

  body('password', 'minSizePass')
    .isLength({min: 5})
    .isAlphanumeric()
    .trim(),
]

exports.loginValidators = [  
  body('password')
    .isLength({min: 5})
    .withMessage('Password length must be at least 3 characters')
    .custom(async (value, {req}) => {

      try {
        const email = req.body.email
        const candidate = await User.findOne({ email })

        if (candidate) {
          // User with same login exists
          const areSame = await bcrypt.compare(value, candidate.password)

          if (areSame) {
            return true
          } else {
            return Promise.reject('Wrong password.')
          }
        } else {
          return Promise.reject('User with same email doesn`t exist.')
        }

      } catch (e) {
        console.log(e)
      }

    })
]