const nodemailer = require('nodemailer');
const config = require('../config/vars');
const logger = require('../config/logger');

/**
 * Configure the email transport using SMTP
 */
const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
        user: config.smtp.username,
        pass: config.smtp.password,
    },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, html) => {
    const msg = {
        from: config.emailFrom,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(msg);
        logger.info(`Email sent to ${to} with subject "${subject}"`);
    } catch (error) {
        logger.error(`Failed to send email to ${to}: ${error.message}`);
        throw new Error('Email could not be sent');
    }
};

/**
 * Send a password reset email
 * @param {string} to - Recipient email
 * @param {string} token - Reset token
 * @returns {Promise<void>}
 */
const sendPasswordResetEmail = async (to, token) => {
    const subject = 'Reset Your Password';
    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    const html = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

    await sendEmail(to, subject, html);
};

/**
 * Send email verification
 * @param {string} to - Recipient email
 * @param {string} token - Verification token
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (to, token) => {
    const subject = 'Verify Your Email';
    const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
    const html = `
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
    <p>If you did not create an account, please ignore this email.</p>
  `;

    await sendEmail(to, subject, html);
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
};
