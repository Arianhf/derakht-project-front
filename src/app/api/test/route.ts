// Simple test endpoint to verify API routes are working
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[TEST] Test endpoint was hit!');
  return NextResponse.json({
    message: 'API routes are working!',
    timestamp: new Date().toISOString()
  });
}
