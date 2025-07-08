import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No image uploaded' }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = mime.extension(file.type);
    const key = `entries/${uuidv4()}.${extension}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    };

    await s3.send(new PutObjectCommand(params));
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
    });
  }
}
// This code handles file uploads to AWS S3 using the AWS SDK for JavaScript v3.
