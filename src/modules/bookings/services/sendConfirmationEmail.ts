import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ConfirmationEmailProps {
    to: string;
    guestName: string;
    bookingRef: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
}

export async function sendConfirmationEmail({
                                                to,
                                                guestName,
                                                bookingRef,
                                                roomName,
                                                checkIn,
                                                checkOut,
                                                totalPrice,
                                            }: ConfirmationEmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.error('❌ Resend Error: RESEND_API_KEY is missing in .env.local');
        return { success: false, error: 'Missing API Key' };
    }

    try {
        // In Resend free tier without a verified domain:
        // 1. 'from' MUST be 'onboarding@resend.dev'
        // 2. 'to' MUST be the email address you registered your Resend account with
        const { data, error } = await resend.emails.send({
            from: 'Seaview Resort <onboarding@resend.dev>',
            to: [to], // Replace with your Resend account email during local testing
            subject: `Booking Confirmed #${bookingRef} - Seaview Kubo Resort`,
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #faf7f2; padding: 24px; color: #1c120c;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e6c898; overflow: hidden;">
            
            <div style="background-color: #1c120c; padding: 20px; text-align: center; color: #faf7f2;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">SEAVIEW</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #c89349; text-transform: uppercase;">Modern Filipino Kubo Sanctuary</p>
            </div>

            <div style="padding: 24px;">
              <h2 style="margin-top: 0; color: #1c120c;">Mabuhay, ${guestName}!</h2>
              <p style="font-size: 14px; color: #2b1d14; line-height: 1.5;">
                Your reservation at <strong>Seaview</strong> has been confirmed by our front desk.
              </p>

              <div style="background-color: #faf7f2; border: 1px solid #e6c898; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase;">Booking Reference</p>
                <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: bold; font-family: monospace; color: #1c120c;">#${bookingRef}</p>
                
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Villa:</strong> ${roomName}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-In:</strong> ${checkIn}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Check-Out:</strong> ${checkOut}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Total Amount:</strong> $${totalPrice}</p>
              </div>

              <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                Need to adjust your stay or ask a question? Reply directly to this email or call our desk.
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
            console.error('❌ Resend API Error:', error);
            return { success: false, error };
        }

        console.log('✅ Confirmation Email Sent Successfully! Message ID:', data?.id);
        return { success: true, data };
    } catch (err) {
        console.error('❌ Failed to execute sendConfirmationEmail:', err);
        return { success: false, error: err };
    }
}