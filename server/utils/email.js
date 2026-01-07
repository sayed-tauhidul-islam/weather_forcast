import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  // For development, use Ethereal (fake SMTP)
  // For production, use Gmail, SendGrid, etc.
  
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development: Use Ethereal for testing
    // Note: In real development, you'd create this account programmatically
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER || 'test@ethereal.email',
        pass: process.env.EMAIL_PASSWORD || 'test123'
      }
    });
  }
};

const transporter = createTransporter();

// Email templates
export const emailTemplates = {
  verification: (name, token, baseUrl) => ({
    subject: '🔐 Verify Your Email - Weather Forecast App',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌤️ Welcome to Weather Forecast!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for registering! Please verify your email address to activate your account.</p>
            <div style="text-align: center;">
              <a href="${baseUrl}/verify-email?token=${token}" class="button">✅ Verify Email</a>
            </div>
            <p>Or copy this link to your browser:</p>
            <p style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${baseUrl}/verify-email?token=${token}
            </p>
            <p>This link will expire in <strong>24 hours</strong>.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2026 Weather Forecast App - Secure & Reliable</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),
  
  passwordReset: (name, token, baseUrl) => ({
    subject: '🔑 Password Reset Request - Weather Forecast App',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${baseUrl}/reset-password?token=${token}" class="button">🔐 Reset Password</a>
            </div>
            <p>Or copy this link to your browser:</p>
            <p style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${baseUrl}/reset-password?token=${token}
            </p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link expires in <strong>1 hour</strong></li>
                <li>If you didn't request this, ignore this email</li>
                <li>Your password won't change unless you click the link</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Weather Forecast App - Secure & Reliable</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),
  
  twoFactorEnabled: (name) => ({
    subject: '🔒 Two-Factor Authentication Enabled',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 2FA Enabled Successfully!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <div class="success">
              <strong>✅ Security Enhanced!</strong>
              <p>Two-Factor Authentication has been enabled on your account.</p>
            </div>
            <p>Your account is now more secure. You'll need your authentication app to log in.</p>
            <p><strong>Make sure to save your backup codes!</strong></p>
            <p>If this wasn't you, please contact support immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),
  
  loginAlert: (name, ipAddress, location) => ({
    subject: '🚨 New Login to Your Account',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>🚨 New Login Detected</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>A new login to your account was detected:</p>
          <ul>
            <li><strong>IP Address:</strong> ${ipAddress}</li>
            <li><strong>Location:</strong> ${location || 'Unknown'}</li>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>If this was you, no action needed. Otherwise, secure your account immediately.</p>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
export const sendEmail = async (to, template) => {
  try {
    const info = await transporter.sendMail({
      from: `"Weather Forecast App" <${process.env.EMAIL_USER || 'noreply@weatherapp.com'}>`,
      to,
      subject: template.subject,
      html: template.html
    });
    
    console.log('📧 Email sent:', info.messageId);
    
    // Preview URL for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
