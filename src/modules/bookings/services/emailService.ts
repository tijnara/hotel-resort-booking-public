import nodemailer from 'nodemailer';

// Create a reusable Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

interface EmailProps {
    to: string;
    guestName: string;
    bookingRef: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
}

/**
 * STAGE 1: Sent immediately to the guest when they submit a booking request.
 */
export async function sendRequestReceivedEmail({
                                                   to,
                                                   guestName,
                                                   bookingRef,
                                                   roomName,
                                                   checkIn,
                                                   checkOut,
                                                   totalPrice,
                                               }: EmailProps) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Gmail Error: GMAIL_USER or GMAIL_APP_PASSWORD missing in .env.local');
        return { success: false, error: 'Missing Credentials' };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Seaview Resort" <${process.env.GMAIL_USER}>`,
            to: to, // Sends directly to ANY guest email!
            subject: `Booking Request Received #${bookingRef} - Seaview Kubo Resort`,
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #faf7f2; padding: 24px; color: #1c120c;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e6c898; overflow: hidden;">
            
            <div style="background-color: #1c120c; padding: 20px; text-align: center; color: #faf7f2;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">SEAVIEW</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #c89349; text-transform: uppercase;">Modern Filipino Kubo Sanctuary</p>
            </div>

            <div style="padding: 24px;">
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: bold; color: #92400e; text-transform: uppercase;">Status: Pending Desk Review</span>
              </div>

              <h2 style="margin-top: 0; color: #1c120c;">Mabuhay, ${guestName}!</h2>
              <p style="font-size: 14px; color: #2b1d14; line-height: 1.5;">
                We have received your reservation request for <strong>Seaview</strong>. Our resort desk is currently reviewing room availability for your selected dates.
              </p>

              <div style="background-color: #faf7f2; border: 1px solid #e6c898; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase;">Request Reference</p>
                <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; font-family: monospace; color: #1c120c;">#${bookingRef}</p>
                
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Villa:</strong> ${roomName}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-In:</strong> ${checkIn}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-Out:</strong> ${checkOut}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Estimated Total:</strong> ₱${Number(totalPrice).toLocaleString()}</p>
              </div>

              <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                You will receive a separate confirmation email once our staff reviews and approves your reservation.
              </p>
            </div>

            <div style="background-color: #faf7f2; padding: 12px; text-align: center; border-top: 1px solid #e6c898; font-size: 10px; color: #888;">
              Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines
            </div>
          </div>
        </div>
      `,
        });

        console.log('✅ Stage 1 Email Sent to Guest via Gmail SMTP:', info.messageId);
        return { success: true, data: info };
    } catch (err) {
        console.error('❌ Failed to send Stage 1 email via Gmail:', err);
        return { success: false, error: err };
    }
}

/**
 * STAGE 2: Sent when admin approves/confirms the stay in the dashboard.
 */
export async function sendConfirmationEmail({
                                                to,
                                                guestName,
                                                bookingRef,
                                                roomName,
                                                checkIn,
                                                checkOut,
                                                totalPrice,
                                            }: EmailProps) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Gmail Error: GMAIL_USER or GMAIL_APP_PASSWORD missing in .env.local');
        return { success: false, error: 'Missing Credentials' };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Seaview Resort" <${process.env.GMAIL_USER}>`,
            to: to, // Sends directly to ANY guest email!
            subject: `Booking Confirmed #${bookingRef} - Seaview Kubo Resort`,
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #faf7f2; padding: 24px; color: #1c120c;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e6c898; overflow: hidden;">
            
            <div style="background-color: #1c120c; padding: 20px; text-align: center; color: #faf7f2;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">SEAVIEW</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #c89349; text-transform: uppercase;">Modern Filipino Kubo Sanctuary</p>
            </div>

            <div style="padding: 24px;">
              <div style="background-color: #d1fae5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: bold; color: #065f46; text-transform: uppercase;">Status: Stay Confirmed</span>
              </div>

              <h2 style="margin-top: 0; color: #1c120c;">Great news, ${guestName}!</h2>
              <p style="font-size: 14px; color: #2b1d14; line-height: 1.5;">
                Your reservation at <strong>Seaview</strong> has been officially confirmed by our resort staff. We are preparing your Kubo villa for your arrival!
              </p>

              <div style="background-color: #faf7f2; border: 1px solid #e6c898; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase;">Official Booking Reference</p>
                <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; font-family: monospace; color: #1c120c;">#${bookingRef}</p>
                
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Villa:</strong> ${roomName}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-In:</strong> ${checkIn}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-Out:</strong> ${checkOut}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Total Amount:</strong> ₱${Number(totalPrice).toLocaleString()}</p>
              </div>

              <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                Have special requests or need to modify your stay? Reply directly to this email or call our desk.
              </p>
            </div>

            <div style="background-color: #faf7f2; padding: 12px; text-align: center; border-top: 1px solid #e6c898; font-size: 10px; color: #888;">
              Seaview Resort & Executive Kubo Suites • Coastal Highway, Philippines
            </div>
          </div>
        </div>
      `,
        });

        console.log('✅ Stage 2 Email Sent to Guest via Gmail SMTP:', info.messageId);
        return { success: true, data: info };
    } catch (err) {
        console.error('❌ Failed to send Stage 2 email via Gmail:', err);
        return { success: false, error: err };
    }
}