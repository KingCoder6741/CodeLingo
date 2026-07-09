import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email, name, token) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@codelingo.dev',
    to: email,
    subject: '🎯 Verify Your CodeLingo Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d8cff;">Welcome to CodeLingo, ${name}! 🚀</h2>
        <p>Please verify your email to get started:</p>
        <a href="${verificationLink}" style="
          display: inline-block;
          background: linear-gradient(135deg, #2d8cff, #00f07a);
          color: #000;
          padding: 12px 24px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        ">Verify Email</a>
        <p>Or copy this link: <code>${verificationLink}</code></p>
        <p style="color: #5f6b80; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendWelcomeEmail(email, name) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@codelingo.dev',
    to: email,
    subject: '✨ Welcome to CodeLingo!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d8cff;">You're all set, ${name}! 🎉</h2>
        <p>Your email is verified. Start learning now:</p>
        <ul>
          <li>📚 Learn Italian or any language</li>
          <li>💻 Master JavaScript, Python, and more</li>
          <li>🏆 Earn XP and climb the leaderboard</li>
          <li>🔥 Build your daily streak</li>
        </ul>
        <p>Happy coding and learning!</p>
        <p style="color: #5f6b80; font-size: 12px;">CodeLingo Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Email error:', error);
  }
}
