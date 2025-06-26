export const emailTemplates = {
  passwordReset: (resetLink: string, userName: string) => ({
    subject: "Reset Your LingslatePal Password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌍 LingslatePal</h1>
            <p>Your AI Language Learning Companion</p>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello ${userName},</p>
            <p>We received a request to reset your password for your LingslatePal account. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            <p>Happy learning!<br>The LingslatePal Team</p>
          </div>
          <div class="footer">
            <p>© 2024 LingslatePal. Made with ❤️ for language learners worldwide.</p>
            <p>This email was sent to you because you have an account with LingslatePal.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Reset Your LingslatePal Password
      
      Hello ${userName},
      
      We received a request to reset your password for your LingslatePal account.
      
      Click this link to create a new password: ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, you can safely ignore this email.
      
      Happy learning!
      The LingslatePal Team
    `,
  }),

  welcomeEmail: (userName: string) => ({
    subject: "Welcome to LingslatePal! 🌍",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to LingslatePal</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌍 Welcome to LingslatePal!</h1>
            <p>Your journey to mastering new languages starts here</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Welcome to the LingslatePal community! We're excited to help you on your language learning journey.</p>
            
            <div class="feature">
              <h3>🔄 Free Translation</h3>
              <p>Translate between 100+ languages instantly with our LibreTranslate integration.</p>
            </div>
            
            <div class="feature">
              <h3>📚 Interactive Lessons</h3>
              <p>Learn with engaging lessons designed by language experts and native speakers.</p>
            </div>
            
            <div class="feature">
              <h3>🧠 Smart Quizzes</h3>
              <p>Test your knowledge with adaptive quizzes that adjust to your learning pace.</p>
            </div>
            
            <div class="feature">
              <h3>🏆 Track Progress</h3>
              <p>Monitor your learning journey with detailed analytics and achievement badges.</p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Start Learning Now</a>
            
            <p>Here are some tips to get started:</p>
            <ul>
              <li>Complete your profile to personalize your experience</li>
              <li>Choose your target language and set daily goals</li>
              <li>Try our quick translation feature</li>
              <li>Take your first lesson to earn XP points</li>
            </ul>
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Happy learning!<br>The LingslatePal Team</p>
          </div>
          <div class="footer">
            <p>© 2024 LingslatePal. Made with ❤️ for language learners worldwide.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to LingslatePal! 🌍
      
      Hello ${userName}!
      
      Welcome to the LingslatePal community! We're excited to help you on your language learning journey.
      
      What you can do with LingslatePal:
      - Translate between 100+ languages instantly
      - Learn with interactive lessons
      - Test your knowledge with smart quizzes  
      - Track your progress with detailed analytics
      
      Get started: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
      
      Tips to get started:
      - Complete your profile
      - Choose your target language
      - Try our translation feature
      - Take your first lesson
      
      Happy learning!
      The LingslatePal Team
    `,
  }),

  achievementUnlocked: (userName: string, achievementName: string, xpEarned: number) => ({
    subject: `🏆 Achievement Unlocked: ${achievementName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Achievement Unlocked</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; }
          .achievement { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; border: 2px solid #f59e0b; }
          .xp-badge { background: #3b82f6; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Achievement Unlocked!</h1>
            <p>Congratulations on your progress!</p>
          </div>
          <div class="content">
            <h2>Great job, ${userName}! 🎉</h2>
            
            <div class="achievement">
              <h3>${achievementName}</h3>
              <div style="font-size: 48px; margin: 20px 0;">🏆</div>
              <span class="xp-badge">+${xpEarned} XP</span>
            </div>
            
            <p>You're making excellent progress on your language learning journey. Keep up the great work!</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Your Progress</a>
            
            <p>Continue learning to unlock more achievements and earn XP points!</p>
          </div>
          <div class="footer">
            <p>© 2024 LingslatePal. Made with ❤️ for language learners worldwide.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🏆 Achievement Unlocked!
      
      Great job, ${userName}!
      
      You've unlocked: ${achievementName}
      XP Earned: +${xpEarned}
      
      You're making excellent progress on your language learning journey. Keep up the great work!
      
      View your progress: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
      
      The LingslatePal Team
    `,
  }),

  weeklyProgress: (userName: string, weeklyStats: any) => ({
    subject: "📊 Your Weekly Learning Progress",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Progress Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .stat { background: white; padding: 20px; margin: 15px 0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Progress Report</h1>
            <p>See how you've been doing this week!</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Here's a summary of your language learning progress this week:</p>
            
            <div class="stat">
              <span>Lessons Completed</span>
              <span class="stat-value">${weeklyStats.lessonsCompleted || 0}</span>
            </div>
            
            <div class="stat">
              <span>Quizzes Taken</span>
              <span class="stat-value">${weeklyStats.quizzesTaken || 0}</span>
            </div>
            
            <div class="stat">
              <span>XP Points Earned</span>
              <span class="stat-value">${weeklyStats.xpEarned || 0}</span>
            </div>
            
            <div class="stat">
              <span>Current Streak</span>
              <span class="stat-value">${weeklyStats.currentStreak || 0} days</span>
            </div>
            
            <div class="stat">
              <span>Time Spent Learning</span>
              <span class="stat-value">${weeklyStats.timeSpent || 0} min</span>
            </div>
            
            <p>Keep up the excellent work! Consistency is key to mastering a new language.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Continue Learning</a>
            
            <p>Remember: Even 10 minutes a day can make a big difference in your language learning journey!</p>
          </div>
          <div class="footer">
            <p>© 2024 LingslatePal. Made with ❤️ for language learners worldwide.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      📊 Weekly Progress Report
      
      Hello ${userName}!
      
      Here's your language learning progress this week:
      
      Lessons Completed: ${weeklyStats.lessonsCompleted || 0}
      Quizzes Taken: ${weeklyStats.quizzesTaken || 0}
      XP Points Earned: ${weeklyStats.xpEarned || 0}
      Current Streak: ${weeklyStats.currentStreak || 0} days
      Time Spent Learning: ${weeklyStats.timeSpent || 0} minutes
      
      Keep up the excellent work!
      
      Continue learning: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
      
      The LingslatePal Team
    `,
  }),
}

export const sendEmail = async (to: string, template: any) => {
  // This would integrate with your email service (SendGrid, Mailgun, etc.)
  // For now, we'll just log the email
  console.log("Email would be sent to:", to)
  console.log("Subject:", template.subject)
  console.log("HTML:", template.html)

  // In production, you would use something like:
  // await emailService.send({
  //   to,
  //   subject: template.subject,
  //   html: template.html,
  //   text: template.text
  // })
}
