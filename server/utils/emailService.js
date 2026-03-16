import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
const smtpPort = Number(process.env.SMTP_PORT || 587)
const smtpSecure =
  process.env.SMTP_SECURE === 'true' ? true : process.env.SMTP_SECURE === 'false' ? false : smtpPort === 465
const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
const smtpPassword = process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD

const assertEmailConfig = () => {
  const missing = []
  if (!smtpUser) missing.push('SMTP_USER (or GMAIL_USER)')
  if (!smtpPassword) missing.push('SMTP_PASSWORD (or GMAIL_APP_PASSWORD)')
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Verify connection configuration
const verifyConnection = async () => {
  try {
    assertEmailConfig()
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Error establishing SMTP connection:', error)
    throw error
  }
}

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await verifyConnection()

    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'Straumann Grp',
        address: process.env.MAIL_FROM || smtpUser,
      },
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendBulkEmails = async (emailsList) => {
  try {
    // Verify connection before sending
    await verifyConnection()
    const results = await Promise.all(
      emailsList.map((emailData) => sendEmail(emailData))
    )
    return { success: true, results }
  } catch (error) {
    console.error('Error sending bulk emails:', error)
    throw error
  }
}
