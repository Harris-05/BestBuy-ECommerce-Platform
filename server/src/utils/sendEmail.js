const { Resend } = require('resend');

const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'BestBuy <onboarding@resend.dev>', // Resend's default testing email
    to: options.email,
    subject: options.subject,
    text: options.message,
  });

  if (error) {
    console.error('Resend Error:', error);
    throw new Error('Email could not be sent');
  }
  if (data) {
    console.log('Email sent successfully:', data.id);
  }
};

module.exports = sendEmail;
