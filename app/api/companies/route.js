import { createCompany } from '@/app/services/companyServices';
import dbConnect from '@/utils/dbConnects';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('[API] Received body:', body);
    const company = await createCompany(body);
    console.log('[API] Company created successfully:', company._id);
    return Response.json({ success: true, data: company }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}


