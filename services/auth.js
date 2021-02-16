const { response } = require('express');
const nodemailer = require('nodemailer');

exports.sendMail = async (user) => {
    const account = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'breskanunikita@gmail.com',
            pass: 'govnopoints2020',
        },
        debug: true,
        logger: true,
    });
    const mailOptions = {
        from: 'breskanunikita@gmail.com',
        to: user.email,
        subject: 'Верифицируйте свой Email в Delidrone',
        text: `https://delidrone.ru/verify-email/${user._id}/${user.verificationString}`,
    };
    account.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
    })
}