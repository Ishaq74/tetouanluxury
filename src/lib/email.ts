import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@tetouanluxury.com';

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: EmailParams) {
  const { to, subject, html, text } = params;

  try {
    await sgMail.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || '',
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendBookingConfirmation(
  email: string,
  booking: {
    id: string;
    villaName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    accessCode: string;
  }
) {
  const html = `
    <h1>Booking Confirmation</h1>
    <p>Thank you for your booking!</p>
    <h2>Booking Details</h2>
    <ul>
      <li><strong>Booking ID:</strong> ${booking.id}</li>
      <li><strong>Villa:</strong> ${booking.villaName}</li>
      <li><strong>Check-in:</strong> ${booking.checkIn}</li>
      <li><strong>Check-out:</strong> ${booking.checkOut}</li>
      <li><strong>Total:</strong> €${booking.totalPrice}</li>
      <li><strong>Access Code:</strong> ${booking.accessCode}</li>
    </ul>
    <p>We look forward to welcoming you!</p>
  `;

  return sendEmail({
    to: email,
    subject: `Booking Confirmation - ${booking.villaName}`,
    html,
  });
}

export async function sendPasswordReset(email: string, resetToken: string) {
  const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${resetToken}`;
  
  const html = `
    <h1>Password Reset Request</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset - Tétouan Luxury Villas',
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <h1>Welcome to Tétouan Luxury Villas!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for creating an account with us.</p>
    <p>Discover our exclusive collection of luxury villas in Tétouan.</p>
    <a href="${process.env.AUTH_URL}/villas">Browse Villas</a>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Tétouan Luxury Villas',
    html,
  });
}
