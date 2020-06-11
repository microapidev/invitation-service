var nodemailer = require('nodemailer');
const EmailValidator = require('email-deep-validator');
const emailValidator = new EmailValidator();
const verifyMail = async (user_email_address) =>{
    let mail_status = false
    const {wellFormed, validDomain, validMailbox} = await emailValidator.verify(user_email_address);
    return {wellFormed,validDomain , validMailbox}
}

const sendHandler = async (req,res) => {
    // console.log(req.body.email);
    let stat = await verifyMail(req.body.email)
    let message = "";
        if (stat.wellFormed && stat.validDomain && stat.validMailbox) {
            res.status(200).send(
                {
                    "message": `We sent a one use code to ${req.body.email}`
                  })
        }else{
          if (!stat.wellFormed) {
              message = `Invalid Email Pattern`
          }if (!stat.validDomain) {
              message = `Invalid Email Domain`
          }if (!stat.validMailbox) {
              message = `Email is inactive`
          }
            
          res.status(401).send(
            {"message":message});
        }
    }
        
module.exports = sendHandler