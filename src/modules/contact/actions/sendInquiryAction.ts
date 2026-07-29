'use server';

import nodemailer from 'nodemailer';
import { getSiteSettings } from '@/modules/settings/services/getSettings';
import { createClient } from '@/modules/shared/lib/supabase/server';

interface InquiryPayload {
    name: string;
    contactNumber: string;
    email: string;
    message: string;
}

export async function sendInquiryAction(payload: InquiryPayload) {
    try {
        const settings = await getSiteSettings();
        const recipientEmail = settings.inquiry_email || 'aranjitarchita@gmail.com';
        const supabase = await createClient();

        // 1. SAVE INQUIRY TO SUPABASE DATABASE
        const { error: dbError } = await supabase.from('inquiries').insert([
            {
                guest_name: payload.name,
                guest_phone: payload.contactNumber,
                guest_email: payload.email || null,
                message: payload.message,
                recipient_email: recipientEmail,
            },
        ]);

        if (dbError) {
            console.error('Supabase DB Insert Error:', dbError.message);
        }

        // 2. CONFIGURE NODEMAILER TRANSPORTER (GMAIL SMTP)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // 3. SEND EMAIL NOTIFICATION TO RECIPIENT
        await transporter.sendMail({
            from: `"${settings.site_name || 'SEAVIEW'} Resort" <${process.env.GMAIL_USER}>`,
            to: recipientEmail,
            replyTo: payload.email || process.env.GMAIL_USER,
            subject: `New Guest Inquiry from ${payload.name}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1c120c; max-width: 600px; margin: 0 auto; border: 1px solid #e6c898; border-radius: 16px; padding: 24px; background-color: #faf7f2;">
          <h2 style="color: #c89349; margin-top: 0; border-bottom: 2px solid #e6c898; padding-bottom: 12px; font-size: 20px;">
            ${settings.site_name || 'SEAVIEW'} — New Guest Inquiry
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #c89349; width: 140px;">Guest Name:</td>
              <td style="padding: 6px 0; color: #1c120c;">${payload.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #c89349;">Contact Number:</td>
              <td style="padding: 6px 0; color: #1c120c;">${payload.contactNumber}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #c89349;">Email Address:</td>
              <td style="padding: 6px 0; color: #1c120c;">${payload.email || 'Not provided'}</td>
            </tr>
          </table>

          <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; margin-top: 20px; border: 1px solid #e6c898;">
            <strong style="color: #c89349; display: block; margin-bottom: 6px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message / Inquiry:</strong>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #2b1d14; white-space: pre-line;">${payload.message}</p>
          </div>

          <p style="font-size: 11px; color: #888; margin-top: 24px; text-align: center;">
            This inquiry was automatically recorded in your Supabase database and forwarded to ${recipientEmail}.
          </p>
        </div>
      `,
        });

        return { success: true };
    } catch (error: any) {
        console.error('Inquiry processing error:', error);
        return { success: false, message: error.message || 'Failed to submit inquiry.' };
    }
}