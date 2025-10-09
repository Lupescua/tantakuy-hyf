import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import s3 from '@/utils/s3Client';
import { getUserFromCookie } from '@/utils/server/auth';
import {
  unauthorized,
  badRequest,
  serverError,
  success,
} from '@/utils/apiResponse';

export async function GET() {
  return success({ ok: true });
}

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return unauthorized();
    }

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return badRequest('No image uploaded');
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const MAX_BYTES = 5 * 1024 * 1024; // 5MB

    if (!file.type.startsWith('image/')) {
      return badRequest('Only images allowed');
    }

    if (buffer.byteLength > MAX_BYTES) {
      return badRequest('File too large');
    }

    const extension = mime.extension(file.type);
    const key = `entries/${user.id}/${uuidv4()}.${extension}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(params));

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return success({ url, key });
  } catch (err) {
    return serverError('Upload failed', err);
  }
}
