import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'ShopSmart <noreply@shopsmart.com>',
    to,
    subject: 'Reset your ShopSmart password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="background:#e94560;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;">
        Reset Password
      </a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  })
}

export async function sendOrderConfirmationEmail(to: string, orderId: string) {
  await resend.emails.send({
    from: 'ShopSmart <noreply@shopsmart.com>',
    to,
    subject: `Order Confirmation #${orderId.slice(-8).toUpperCase()}`,
    html: `<p>Your order has been placed! Order ID: ${orderId}</p>`,
  })
}
