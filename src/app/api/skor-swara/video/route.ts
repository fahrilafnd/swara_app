import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const videoFile = formData.get('video');

  if (!videoFile || !(videoFile instanceof File)) {
    return NextResponse.json({ ok: false, message: 'No video file provided' }, { status: 400 });
  }

  // Simpan video ke server atau ke storage yang diinginkan
  // Misalnya, menggunakan AWS S3, Google Cloud Storage, atau database
  // const result = await saveVideoToStorage(videoFile);

  return NextResponse.json({ ok: true, message: 'Video uploaded successfully' }, { status: 200 });
}