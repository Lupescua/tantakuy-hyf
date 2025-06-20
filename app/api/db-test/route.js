import dbConnect from '@/utils/dbConnects';

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ connected: true });
  } catch (err) {
    return Responce.json(
      { connected: false, error: err.message },
      { status: 500 },
    );
  }
}
