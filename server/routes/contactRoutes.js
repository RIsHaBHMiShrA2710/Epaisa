const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { name, email, phone, message } = req.body;
    const Admin_email = process.env.EMAIL_USER;
    const Admin_pass = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: Admin_email,
            pass: Admin_pass,
        },
    });
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New message from ${name}`,
        html: `
          <h3>New Contact Request</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }

});

module.exports = router;