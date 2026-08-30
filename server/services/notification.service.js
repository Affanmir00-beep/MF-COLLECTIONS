const nodemailer = require('nodemailer');

// Mock email service for development/demonstration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

const sendEmail = async (options) => {
  if (process.env.NODE_ENV === 'test') return;
  
  try {
    await transporter.sendMail({
      from: '"Vanya Store" <noreply@vanya.pk>',
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Email sent to ${options.email}`);
  } catch (err) {
    console.error('Error sending email:', err);
    // Do not throw error to avoid rolling back transactional operations on notification failure
  }
};

const notifyAdminNewOrder = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vanya.pk';
  await sendEmail({
    email: adminEmail,
    subject: `New Order Placed: ${order.orderNumber}`,
    html: `
      <h2>New Order Received</h2>
      <p>Order Number: ${order.orderNumber}</p>
      <p>Total: $${order.grandTotal}</p>
      <p>Please check the admin dashboard for details.</p>
    `
  });
};

const notifyCustomerOrder = async (order) => {
  const email = order.user?.email || order.guestInfo?.email;
  if (!email) return;

  await sendEmail({
    email: email,
    subject: `Order Confirmation: ${order.orderNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
      <p>Total: $${order.grandTotal}</p>
    `
  });
};

const sendOTP = async (email, otpCode) => {
  await sendEmail({
    email,
    subject: 'Your Verification Code',
    html: `<h2>Your OTP is: <strong>${otpCode}</strong></h2><p>It will expire in 10 minutes.</p>`
  });
};

module.exports = {
  sendEmail,
  notifyAdminNewOrder,
  notifyCustomerOrder,
  sendOTP
};
