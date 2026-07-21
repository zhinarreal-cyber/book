import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check credentials (hardcoded admin user)
    if (username === 'admin' && password === 'admin123') {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'secret-auth-token-12345', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'ناوی بەکارهێنەر یان وشەی تێپەڕ نادروستە' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'سێرڤەر تووشی کێشە بوو' },
      { status: 500 }
    );
  }
}
