import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
 * STAGE 1: Sent immediately after the guest submits their booking request.
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
    if (!process.env.RESEND_API_KEY) {
        console.error('❌ Resend Error: RESEND_API_KEY is missing in .env.local');
        return { success: false, error: 'Missing API Key' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Seaview Resort <onboarding@resend.dev>',
            to: [to],
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
                <p style="margin: 0; font-size: 13px;"><strong>Estimated Total:</strong> $${totalPrice}</p>
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

        if (error) {
            console.error('❌ Resend API Error (Stage 1):', error);
            return { success: false, error };
        }

        console.log('✅ Stage 1: Request Received Email Sent!');
        return { success: true, data };
    } catch (err) {
        console.error('❌ Failed to execute sendRequestReceivedEmail:', err);
        return { success: false, error: err };
    }
}

/**
 * STAGE 2: Sent when the admin approves/confirms the stay in the admin dashboard.
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
    if (!process.env.RESEND_API_KEY) {
        console.error('❌ Resend Error: RESEND_API_KEY is missing in .env.local');
        return { success: false, error: 'Missing API Key' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Seaview Resort <onboarding@resend.dev>',
            to: [to],
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
                <p style="margin: 0; font-size: 13px;"><strong>Total Amount:</strong> $${totalPrice}</p>
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

        if (error) {
            console.error('❌ Resend API Error (Stage 2):', error);
            return { success: false, error };
        }

        console.log('✅ Stage 2: Confirmation Email Sent Successfully!');
        return { success: true, data };
    } catch (err) {
        console.error('❌ Failed to execute sendConfirmationEmail:', err);
        return { success: false, error: err };
    }
}