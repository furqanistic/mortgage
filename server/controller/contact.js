import { sendEmail } from '../utils/emailService.js'

const validateGermanPhone = (number) => {
  const germanPhoneRegex = /^(\+49|0)[1-9][0-9]{5,14}$/
  return germanPhoneRegex.test(String(number || '').replace(/\s/g, ''))
}

export const submitConsultationRequest = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      euCitizen,
      residencyStatus,
      preferredLanguage,
      email,
      phone,
      message,
      submittedAt,
    } = req.body || {}

    if (
      !firstName ||
      !lastName ||
      !euCitizen ||
      !preferredLanguage ||
      !email ||
      !phone
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields in consultation request.',
      })
    }

    if (euCitizen === 'non-eu' && !residencyStatus) {
      return res.status(400).json({
        status: 'error',
        message: 'Residency status is required for non-EU citizens.',
      })
    }

    if (!validateGermanPhone(phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid German phone number.',
      })
    }

    const targetEmail =
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.SMTP_TO ||
      process.env.MAIL_TO ||
      process.env.MAIL_FROM ||
      process.env.SMTP_USER ||
      process.env.GMAIL_USER
    if (!targetEmail) {
      return res.status(500).json({
        status: 'error',
        message: 'Contact email receiver is not configured.',
      })
    }

    const nationalityLabel =
      euCitizen === 'eu'
        ? 'EU Citizen'
        : euCitizen === 'non-eu'
          ? 'Non-EU Citizen'
          : euCitizen
    const languageLabelMap = {
      german: 'Deutsch (German)',
      english: 'English',
      urdu: 'Urdu (اردو)',
      punjabi: 'Punjabi (ਪੰਜਾਬੀ)',
      hindi: 'Hindi (हिन्दी)',
    }
    const residencyLabelMap = {
      'blue-card': 'Blue Card',
      visa: 'Visa Residency',
      permanent: 'Permanent Residency',
      limited: 'Limited Residency',
    }

    const cleanMessage = message?.trim() || 'No message provided'
    const timestamp = submittedAt || new Date().toLocaleString()
    const fullName = `${firstName} ${lastName}`.trim()
    const subject = `New Consultation Request - ${fullName}`
    const text = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Citizenship: ${nationalityLabel}`,
      `Residency Status: ${residencyLabelMap[residencyStatus] || residencyStatus || 'N/A'}`,
      `Preferred Language: ${languageLabelMap[preferredLanguage] || preferredLanguage}`,
      `Submitted At: ${timestamp}`,
      '',
      'Message:',
      cleanMessage,
    ].join('\n')
    const html = `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Citizenship:</strong> ${nationalityLabel}</p>
      <p><strong>Residency Status:</strong> ${residencyLabelMap[residencyStatus] || residencyStatus || 'N/A'}</p>
      <p><strong>Preferred Language:</strong> ${languageLabelMap[preferredLanguage] || preferredLanguage}</p>
      <p><strong>Submitted At:</strong> ${timestamp}</p>
      <p><strong>Message:</strong></p>
      <p>${cleanMessage}</p>
    `

    await sendEmail({
      to: targetEmail,
      subject,
      text,
      html,
    })

    res.status(200).json({
      status: 'success',
      message: 'Consultation request submitted successfully.',
    })
  } catch (error) {
    next(error)
  }
}
