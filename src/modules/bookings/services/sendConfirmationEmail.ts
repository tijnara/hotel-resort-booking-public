import { sendConfirmationEmail as sendGmailConfirmation, EmailProps } from './emailService';

/**
 * Re-export wrapper pointing to standard Gmail SMTP email dispatcher
 */
export async function sendConfirmationEmail(props: EmailProps) {
    return sendGmailConfirmation(props);
}