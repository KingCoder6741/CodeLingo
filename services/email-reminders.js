export async function sendStreakReminder(email, name, streak) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@codelingo.dev',
    to: email,
    subject: `🔥 Keep Your ${streak}-Day Streak Going!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00f07a;">Don't Break Your Streak! 🔥</h2>
        <p>Hey ${name},</p>
        <p>You have a <strong>${streak}-day streak</strong> going! Just a friendly reminder to complete a lesson today to keep it alive.</p>
        <div style="
          background: linear-gradient(135deg, #2d8cff, #00f07a);
          color: #000;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        ">
          <a href="${process.env.FRONTEND_URL}" style="
            color: #000;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
          ">Go Learn Now</a>
        </div>
        <p style="color: #5f6b80; font-size: 12px;">
          ${streak >= 7 ? '🏅 You\'re an awesome learner!' : ''}
          ${streak >= 30 ? '🌟 A month of consistency! Incredible!' : ''}
          ${streak >= 100 ? '👑 Legend status achieved!' : ''}
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${email}`);
  } catch (error) {
    console.error('Reminder email error:', error);
  }
}
