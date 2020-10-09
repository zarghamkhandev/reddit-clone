import nodemailer from 'nodemailer';

export default async (to: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'ua6wi7c4xcjg43rd@ethereal.email',
      pass: 'weDHMYSXs4ZRnPzCVf',
    },
  });
  const info = await transporter.sendMail({
    from: 'Fred Foo <foo@example.com>',
    to: to,
    subject: 'Change Password',
    html: text,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL : %s', nodemailer.getTestMessageUrl(info));
};
