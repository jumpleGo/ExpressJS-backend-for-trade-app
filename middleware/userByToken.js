const User        = require('./../models/user')

async function UserByToken (token) {
  try {
    const user = await User.findOne({ token })

    if (user){
      return user
    }else {
      return null
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = UserByToken;