const MUser        = require('./../models/MUser')

async function UserByToken (token) {
  try {
    const user = await MUser.findOne({ token })

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