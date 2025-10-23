// Simple email service for development/testing
// In production, you would integrate with a real email service like SendGrid, Mailgun, etc.

export const sendEmail = async (to, subject, htmlContent, textContent) => {
  // For development, we'll just log the email content
  console.log("=".repeat(50));
  console.log("📧 EMAIL SENT");
  console.log("=".repeat(50));
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("Content:");
  console.log(htmlContent);
  console.log("=".repeat(50));

  // In a real application, you would send the actual email here
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: to,
    from: 'noreply@bluehavenrentals.com',
    subject: subject,
    text: textContent,
    html: htmlContent,
  };
  
  return await sgMail.send(msg);
  */

  // For now, return a successful response
  return {
    success: true,
    messageId: `dev-${Date.now()}`,
    message: "Email sent successfully (development mode)"
  };
};

// Generate HTML email template for verification
export const generateVerificationEmailHTML = (userName, verificationCode) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - Blue Haven Rentals</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3ABBD0, #263D5D); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .verification-code { background: #3ABBD0; color: white; font-size: 24px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { background: #3ABBD0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Blue Haven Rentals</h1>
          <h2>Email Verification</h2>
        </div>
        <div class="content">
          <h3>Hello ${userName}!</h3>
          <p>Thank you for signing up with Blue Haven Rentals. To complete your registration, please verify your email address using the code below:</p>
          
          <div class="verification-code">
            ${verificationCode}
          </div>
          
          <p>This verification code will expire in 10 minutes for security reasons.</p>
          
          <p>If you didn't create an account with Blue Haven Rentals, please ignore this email.</p>
          
          <p>Best regards,<br>The Blue Haven Rentals Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Blue Haven Rentals. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate text version of verification email
export const generateVerificationEmailText = (userName, verificationCode) => {
  return `
Blue Haven Rentals - Email Verification

Hello ${userName}!

Thank you for signing up with Blue Haven Rentals. To complete your registration, please verify your email address using the code below:

Verification Code: ${verificationCode}

This verification code will expire in 10 minutes for security reasons.

If you didn't create an account with Blue Haven Rentals, please ignore this email.

Best regards,
The Blue Haven Rentals Team

---
© 2024 Blue Haven Rentals. All rights reserved.
This is an automated message, please do not reply to this email.
  `;
};
