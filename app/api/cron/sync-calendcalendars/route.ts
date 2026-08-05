import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder for calendar synchronization logic
  console.log('Cron job triggered: Syncing calendars...');
  return NextResponse.json({ message: 'Calendar synchronization started.' });
}
