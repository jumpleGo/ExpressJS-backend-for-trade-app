const {Router}    = require('express') 
const router      = Router()
const bcrypt      = require('bcryptjs')
const MUser        = require('../../models/MUser')
const nodemailer  = require('nodemailer');

router.post('/reset', async (req, res) => {
  try {
    console.log(" req.body",  req.body)
    const candidate = await MUser.findOne({ email: req.body.email })
    
    
    if (candidate) {
      const newPassword = Math.random().toString(20).slice(10) + Math.random().toString(20).slice(10)
      const hashPassword = await bcrypt.hash(newPassword, 10)

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'traidgapp@gmail.com',
          pass: 'traiding1111'
        }
      });

      let result = await transporter.sendMail({
        from: 'traidgapp@gmail.com',
        to: `${req.body.email}`,
        subject: 'Сброс пароля',
        text: `Ваш новый пароль ${newPassword}`
      });
      console.log("result", result)

      await MUser.updateOne(
        { email: req.body.email }, 
        { $set : { password: hashPassword } }
      )

      res.status(200).json({ data: 'sended'})

    } else {
      res.json({ error: 'email_not_found'})
    }
    

  } catch (e) {
    console.log(e)
  } 
})

module.exports = router