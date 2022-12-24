import axios from 'axios';
import { Job, DoneCallback } from 'bull';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
dotenv.config();
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: `${process.env.MAIL}`, // generated ethereal user
        pass: `${process.env.GMAIL_PASSWORD}`, // generated ethereal password
    },
})
export default async function (job: Job, cb: DoneCallback) {
    // for (let i = 0; i < 100000000; i++) {
    //     console.log(i);
    // }
    transporter.sendMail({
        from: `${process.env.MAIL}`, // sender address
        to: job.data.to, // list of receivers
        replyTo: `${process.env.MAIL}`,
        subject: job.data.subject, // Subject line
        text: job.data.text, // plain text body
        html: job.data.html, // html body
    })
        .then(data => {
            console.log(data);
            cb(null, 'It works');
        })
        .catch(err => {
            console.log(err);
            return cb(err, null)
        })
}