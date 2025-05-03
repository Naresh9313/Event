

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { format } from "date-fns";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email transporter is ready");
  } catch (error) {
    console.error(" Email transporter configuration failed:", error);
  }
};

verifyTransporter(); 

export const sendRegistrationEmail = async (userEmail, event) => {
  try {
    const eventDate = format(new Date(event.date), "PPP");
    const eventTime = format(new Date(event.date), "p");

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Event Registration System" <no-reply@example.com>',
      to: userEmail,
      subject: `Registration Confirmation: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Confirmation</h2>
          <p>Thank you for registering for the following event:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${event.title}</h3>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
          <p>We look forward to seeing you there!</p>
          <p>If you have any questions or need to cancel your registration, please contact us.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Registration email sent:", info.messageId);
    console.log(" EMAIL CONFIG:", {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      user: process.env.EMAIL_USER,
    });

    return info;
  } catch (error) {
    console.error(" Error sending registration email:", error);
  }
};




