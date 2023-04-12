import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = (message: string) => {
  console.log(message)
  const mailOptions = {
    from: 'Meodihere <lonelywarrior2902@gmail.com>',
    to: 'hhnad2002@gmail.com',
    subject: 'Event Report',
    html: `<h1>Warning</h1>
           <p>${message}</p>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};
