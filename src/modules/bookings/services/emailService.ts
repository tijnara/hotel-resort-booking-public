import nodemailer from 'nodemailer';
import { getSiteSettings, EmailTemplateItem } from '@/modules/settings/services/getSettings';

type ExtendedEmailTemplate = EmailTemplateItem & {
    header_title?: string;
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export interface EmailProps {
    to: string;
    guestName: string;
    bookingRef: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    paymentMethod?: 'gcash' | 'bank' | string;
    cancellationReason?: string;
}

function replacePlaceholders(text: string, vars: Record<string, string | number>) {
    let result = text || '';
    Object.entries(vars).forEach(([key, val]) => {
        result = result.replaceAll(`{${key}}`, String(val ?? ''));
    });
    return result;
}

/**
 * STAGE 1: Sent immediately to the guest when a booking request is created (Pending Status)
 */
export async function sendRequestReceivedEmail(props: EmailProps) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Gmail Error: GMAIL_USER or GMAIL_APP_PASSWORD missing in .env.local');
        return { success: false, error: 'Missing Credentials' };
    }

    const settings = await getSiteSettings();
    const tmpl = settings.email_templates?.request_received as ExtendedEmailTemplate | undefined;

    const formattedPayment = props.paymentMethod === 'gcash' ? 'GCash / Maya' : 'Bank Transfer (BDO)';

    const vars = {
        guestName: props.guestName,
        bookingRef: props.bookingRef,
        roomName: props.roomName,
        checkIn: props.checkIn,
        checkOut: props.checkOut,
        totalPrice: Number(props.totalPrice).toLocaleString(),
        paymentMethod: formattedPayment,
    };

    const headerTitle = replacePlaceholders(tmpl?.header_title || settings.site_name || 'SEAVIEW', vars);
    const subject = replacePlaceholders(tmpl?.subject || 'Booking Request Received #{bookingRef} - Seaview Resort', vars);
    const badge = replacePlaceholders(tmpl?.status_badge || 'Status: Pending Desk Review', vars);
    const heading = replacePlaceholders(tmpl?.heading || 'Reservation Request Received', vars);
    const body = replacePlaceholders(tmpl?.body_text || 'Mabuhay {guestName}! We have received your staycation request for {roomName}. Our resort desk is currently verifying your payment.', vars);
    const footer = replacePlaceholders(tmpl?.footer_text || 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines', vars);

    try {
        const info = await transporter.sendMail({
            from: `"${settings.site_name || 'Seaview Resort'}" <${process.env.GMAIL_USER}>`,
            to: props.to,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #faf7f2; padding: 24px; color: #1c120c;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e6c898; overflow: hidden;">
            <div style="background-color: #1c120c; padding: 20px; text-align: center; color: #faf7f2;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">${headerTitle}</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #c89349; text-transform: uppercase;">Modern Filipino Kubo Sanctuary</p>
            </div>
            <div style="padding: 24px;">
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: bold; color: #92400e; text-transform: uppercase;">${badge}</span>
              </div>
              <h2 style="margin-top: 0; color: #1c120c;">${heading}</h2>
              <p style="font-size: 14px; color: #2b1d14; line-height: 1.5;">${body}</p>
              <div style="background-color: #faf7f2; border: 1px solid #e6c898; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase;">Request Reference</p>
                <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; font-family: monospace; color: #1c120c;">#${props.bookingRef}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Villa:</strong> ${props.roomName}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-In:</strong> ${props.checkIn}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-Out:</strong> ${props.checkOut}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Selected Payment Channel:</strong> ${formattedPayment}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Total Amount:</strong> ₱${Number(props.totalPrice).toLocaleString()}</p>
              </div>
              <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                You will receive an official confirmation email once our staff verifies your payment receipt.
              </p>
            </div>
            <div style="background-color: #faf7f2; padding: 12px; text-align: center; border-top: 1px solid #e6c898; font-size: 10px; color: #888;">
              ${footer}
            </div>
          </div>
        </div>
      `,
        });
        return { success: true, data: info };
    } catch (err: unknown) {
        return { success: false, error: err };
    }
}

/**
 * STAGE 2: Sent when a booking is confirmed or approved by admin
 */
export async function sendConfirmationEmail(props: EmailProps) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Gmail Error: GMAIL_USER or GMAIL_APP_PASSWORD missing in .env.local');
        return { success: false, error: 'Missing Credentials' };
    }

    const settings = await getSiteSettings();
    const tmpl = settings.email_templates?.confirmed as ExtendedEmailTemplate | undefined;

    const vars = {
        guestName: props.guestName,
        bookingRef: props.bookingRef,
        roomName: props.roomName,
        checkIn: props.checkIn,
        checkOut: props.checkOut,
        totalPrice: Number(props.totalPrice).toLocaleString(),
    };

    const headerTitle = replacePlaceholders(tmpl?.header_title || settings.site_name || 'SEAVIEW', vars);
    const subject = replacePlaceholders(tmpl?.subject || '[CONFIRMED] Official Reservation #{bookingRef} - Seaview Resort', vars);
    const badge = replacePlaceholders(tmpl?.status_badge || 'Status: Stay Confirmed', vars);
    const heading = replacePlaceholders(tmpl?.heading || 'Your Staycation is Confirmed!', vars);
    const body = replacePlaceholders(tmpl?.body_text || 'Great news {guestName}! Your payment has been verified and your stay at {roomName} is officially confirmed.', vars);
    const footer = replacePlaceholders(tmpl?.footer_text || 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines', vars);

    try {
        const info = await transporter.sendMail({
            from: `"${settings.site_name || 'Seaview Resort'}" <${process.env.GMAIL_USER}>`,
            to: props.to,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #faf7f2; padding: 24px; color: #1c120c;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e6c898; overflow: hidden;">
            <div style="background-color: #1c120c; padding: 20px; text-align: center; color: #faf7f2;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">${headerTitle}</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #c89349; text-transform: uppercase;">Modern Filipino Kubo Sanctuary</p>
            </div>
            <div style="padding: 24px;">
              <div style="background-color: #d1fae5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: bold; color: #065f46; text-transform: uppercase;">${badge}</span>
              </div>
              <h2 style="margin-top: 0; color: #1c120c;">${heading}</h2>
              <p style="font-size: 14px; color: #2b1d14; line-height: 1.5;">${body}</p>
              
              <!-- Official Proof of Reservation Notice -->
              <div style="background-color: #c89349; color: #ffffff; padding: 14px; border-radius: 10px; font-weight: bold; text-align: center; margin: 20px 0; font-size: 12px; line-height: 1.4;">
                📌 Please present this email at the resort front desk upon check-in as your official proof of reservation.
              </div>

              <div style="background-color: #faf7f2; border: 1px solid #e6c898; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase;">Official Booking Reference</p>
                <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; font-family: monospace; color: #1c120c;">#${props.bookingRef}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Villa:</strong> ${props.roomName}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-In:</strong> ${props.checkIn}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-Out:</strong> ${props.checkOut}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Total Amount Paid:</strong> ₱${Number(props.totalPrice).toLocaleString()}</p>
              </div>
              <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                Have special requests or need to modify your stay? Reply directly to this email or call our desk.
              </p>
            </div>
            <div style="background-color: #faf7f2; padding: 12px; text-align: center; border-top: 1px solid #e6c898; font-size: 10px; color: #888;">
              ${footer}
            </div>
          </div>
        </div>
      `,
        });
        return { success: true, data: info };
    } catch (err: unknown) {
        return { success: false, error: err };
    }
}

/**
 * STAGE 3: Sent when a booking is cancelled by admin
 */
export async function sendCancellationEmail(props: EmailProps) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Gmail Error: GMAIL_USER or GMAIL_APP_PASSWORD missing in .env.local');
        return { success: false, error: 'Missing Credentials' };
    }

    const settings = await getSiteSettings();
    const tmpl = settings.email_templates?.cancelled as ExtendedEmailTemplate | undefined;

    const vars = {
        guestName: props.guestName,
        bookingRef: props.bookingRef,
        roomName: props.roomName,
        checkIn: props.checkIn,
        checkOut: props.checkOut,
        totalPrice: Number(props.totalPrice).toLocaleString(),
        cancellationReason: props.cancellationReason || 'Cancelled by Resort Desk',
    };

    const headerTitle = replacePlaceholders(tmpl?.header_title || settings.site_name || 'SEAVIEW', vars);
    const subject = replacePlaceholders(tmpl?.subject || 'Booking Cancelled #{bookingRef} - Seaview Resort', vars);
    const badge = replacePlaceholders(tmpl?.status_badge || 'Status: Reservation Cancelled', vars);
    const heading = replacePlaceholders(tmpl?.heading || 'Reservation Request Cancelled', vars);
    const body = replacePlaceholders(tmpl?.body_text || 'Dear {guestName}, we regret to inform you that your reservation request for {roomName} has been cancelled by our resort desk.', vars);
    const footer = replacePlaceholders(tmpl?.footer_text || 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines', vars);

    const refundSubject = encodeURIComponent(`Refund Request for Booking #${props.bookingRef}`);

    try {
        const info = await transporter.sendMail({
            from: `"${settings.site_name || 'Seaview Resort'}" <${process.env.GMAIL_USER}>`,
            to: props.to,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #faf7f2; padding: 24px; color: #1c120c;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e6c898; overflow: hidden;">
            <div style="background-color: #1c120c; padding: 20px; text-align: center; color: #faf7f2;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">${headerTitle}</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #c89349; text-transform: uppercase;">Modern Filipino Kubo Sanctuary</p>
            </div>
            <div style="padding: 24px;">
              <div style="background-color: #ffe4e6; border: 1px solid #fecdd3; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: bold; color: #9f1239; text-transform: uppercase;">${badge}</span>
              </div>
              <h2 style="margin-top: 0; color: #1c120c;">${heading}</h2>
              <p style="font-size: 14px; color: #2b1d14; line-height: 1.5;">${body}</p>

              ${props.cancellationReason ? `
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin: 16px 0; color: #991b1b; font-size: 13px;">
                <strong>Reason for Cancellation:</strong> ${props.cancellationReason}
              </div>
              ` : ''}

              <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 12px; margin: 16px 0;">
                <p style="margin: 0; font-size: 12px; font-weight: bold; color: #c2410c;">
                  ⚠️ Policy Notice: Standard cancelled reservations are non-refundable unless approved for refund review.
                </p>
              </div>
              <div style="background-color: #faf7f2; border: 1px solid #e6c898; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase;">Cancelled Reference</p>
                <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; font-family: monospace; color: #1c120c;">#${props.bookingRef}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Villa:</strong> ${props.roomName}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Requested Check-In:</strong> ${props.checkIn}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Requested Check-Out:</strong> ${props.checkOut}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Total Amount:</strong> ₱${Number(props.totalPrice).toLocaleString()}</p>
              </div>
              <p style="font-size: 12px; color: #666; margin-bottom: 16px;">
                If you believe you qualify for a refund exception or wish to discuss your request with management, please click the button below:
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="mailto:${process.env.GMAIL_USER}?subject=${refundSubject}" 
                   style="display: inline-block; background-color: #c89349; color: #1c120c; padding: 12px 24px; border-radius: 10px; font-size: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                  Request Refund Review
                </a>
              </div>
            </div>
            <div style="background-color: #faf7f2; padding: 12px; text-align: center; border-top: 1px solid #e6c898; font-size: 10px; color: #888;">
              ${footer}
            </div>
          </div>
        </div>
      `,
        });
        return { success: true, data: info };
    } catch (err: unknown) {
        return { success: false, error: err };
    }
}

/**
 * STAGE 4: Sent when a refund is processed by admin
 */
export async function sendRefundEmail(props: EmailProps) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Gmail Error: GMAIL_USER or GMAIL_APP_PASSWORD missing in .env.local');
        return { success: false, error: 'Missing Credentials' };
    }

    const settings = await getSiteSettings();
    const tmpl = settings.email_templates?.refunded as ExtendedEmailTemplate | undefined;

    const vars = {
        guestName: props.guestName,
        bookingRef: props.bookingRef,
        roomName: props.roomName,
        checkIn: props.checkIn,
        checkOut: props.checkOut,
        totalPrice: Number(props.totalPrice).toLocaleString(),
    };

    const headerTitle = replacePlaceholders(tmpl?.header_title || settings.site_name || 'SEAVIEW', vars);
    const subject = replacePlaceholders(tmpl?.subject || 'Refund Processed #{bookingRef} - Seaview Resort', vars);
    const badge = replacePlaceholders(tmpl?.status_badge || 'Status: Refund Processed', vars);
    const heading = replacePlaceholders(tmpl?.heading || 'Refund Confirmation', vars);
    const body = replacePlaceholders(tmpl?.body_text || 'Dear {guestName}, your refund request for booking #{bookingRef} ({roomName}) has been processed successfully.', vars);
    const footer = replacePlaceholders(tmpl?.footer_text || 'Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines', vars);

    try {
        const info = await transporter.sendMail({
            from: `"${settings.site_name || 'Seaview Resort'}" <${process.env.GMAIL_USER}>`,
            to: props.to,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #faf7f2; padding: 24px; color: #1c120c;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e6c898; overflow: hidden;">
            <div style="background-color: #1c120c; padding: 20px; text-align: center; color: #faf7f2;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">${headerTitle}</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #c89349; text-transform: uppercase;">Modern Filipino Kubo Sanctuary</p>
            </div>

            <div style="padding: 24px;">
              <div style="background-color: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: bold; color: #6b21a8; text-transform: uppercase;">${badge}</span>
              </div>

              <h2 style="margin-top: 0; color: #1c120c;">${heading}</h2>
              <p style="font-size: 14px; color: #2b1d14; line-height: 1.5;">${body}</p>

              <div style="background-color: #faf7f2; border: 1px solid #e6c898; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase;">Refund Receipt Details</p>
                <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; font-family: monospace; color: #1c120c;">#${props.bookingRef}</p>
                
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Villa:</strong> ${props.roomName}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Original Check-In:</strong> ${props.checkIn}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Original Check-Out:</strong> ${props.checkOut}</p>
                <p style="margin: 0; font-size: 15px; font-weight: bold; color: #6b21a8; padding-top: 8px;"><strong>Amount Refunded:</strong> ₱${Number(props.totalPrice).toLocaleString()}</p>
              </div>

              <p style="font-size: 12px; color: #666; margin-bottom: 0; line-height: 1.5;">
                Depending on your banking provider, funds will reflect back on your account within 3–5 business days. If you have any further questions, please feel free to reply directly to this email.
              </p>
            </div>

            <div style="background-color: #faf7f2; padding: 12px; text-align: center; border-top: 1px solid #e6c898; font-size: 10px; color: #888;">
              ${footer}
            </div>
          </div>
        </div>
      `,
        });

        return { success: true, data: info };
    } catch (err: unknown) {
        return { success: false, error: err };
    }
}