import { validateToken } from '@/app/services/tokenValidationService';
import { AppError } from '@/utils/errorHandler';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { token, email } = await req.json();
    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: 'Missing email or token' },
        { status: 400 },
      );
    }
    const { success, message } = await validateToken(email, token);
    return NextResponse.json({ success, message });
  } catch (err) {
    console.error('validate-token error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
