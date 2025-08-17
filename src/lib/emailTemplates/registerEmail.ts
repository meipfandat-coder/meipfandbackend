interface RegisterEmailProps{
email:string,
firstName:string,
lastName:string,
role:string, 
redirectURL:string
}

export function RegisterEmailTemplate({email, firstName, lastName, role, redirectURL}:RegisterEmailProps){
    return {
          from: "register@meipfand.at",
          to: [email, "register@meipfand.at" , "devbymoaz@gmail.com"],
          subject: "Verify Your Email - Bottle Recycling Platform",
          html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f6fff7; color: #2e7d32; border: 1px solid #c8e6c9; border-radius: 8px;">
          <h2 style="text-align: center; color: #388e3c;">Welcome to Bottle Recycling!</h2>
          <p>Hi <strong>${firstName} ${lastName}</strong>,</p>
          <p>Thank you for registering on our platform as a <strong>${role}</strong>. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${redirectURL}" style="padding: 12px 24px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, you can also click or paste this link into your browser:</p>
          <p style="word-break: break-all;"><a href="${redirectURL}" style="color: #2e7d32;">${redirectURL}</a></p>
          <p style="margin-top: 30px;">♻️ Let's make the planet greener — one bottle at a time!</p>
          <hr style="border: none; border-top: 1px solid #c8e6c9;">
          <p style="font-size: 12px; color: #777;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
        };
    
}