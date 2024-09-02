const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3ade27e635e903",
    pass: "fab9d9dad83191"
  }
});

const sendMail = (email, filename, next) => {
  var mailOptions = {
    from: 'carhunter@company.com',
    to: email,
    subject: 'Auction Car Winning!',
    text: 'This is your invoice about your winning bid.',
    attachments: [{
      filename: 'invoice_auction.pdf',
      path: `${ filename }`
    }]
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      next('fail')
    } else {
      console.log('Email sent: ' + info.response);
      next('sent')
    }
    fs.unlinkSync(filename)
  });
}

module.exports = {
  sendMail
}