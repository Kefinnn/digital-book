import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();
    const expectedPin =
      process.env.ADMIN_PIN ||
      process.env.NEXT_PUBLIC_ADMIN_PIN ||
      'admin123';

    if (pin && String(pin).trim() === expectedPin) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json(
      { authenticated: false, error: 'PIN / Password Admin tidak sesuai.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false, error: 'Permintaan autentikasi tidak valid.' },
      { status: 400 }
    );
  }
}
