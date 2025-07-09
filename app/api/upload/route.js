import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token); 

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const MAX_BYTES = 5 * 1024 * 1024; // 5MB

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only images allowed' },
        { status: 400 },
      );
    }

    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const extension = mime.extension(file.type);
    const key = `entries/${user.id}/${uuidv4()}.${extension}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    };

    await s3.send(new PutObjectCommand(params));

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ url, key }, { status: 200 });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
// This code handles file uploads to AWS S3, ensuring the user is authenticated and the file meets size and type requirements.