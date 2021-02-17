const { response } = require('express');
const nodemailer = require('nodemailer');

exports.sendMail = async (user) => {
    const account = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: '465',
        auth: {
            user: 'delidrone@mail.ru',
            pass: 'govnopoints2021',
        },
        secure: true,
        debug: true,
        logger: true,
    });
    const mailOptions = {
        from: 'delidrone@mail.ru',
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