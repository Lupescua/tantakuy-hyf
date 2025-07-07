import mongoose from 'mongoose';
import Company from '../../models/Company';
import dbConnect from '@/utils/dbConnects';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');
  console.log('company_iddddd', companyId);

  if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
    return Response.json(
      { success: false, message: 'Invalid or missing companyId' },
      { status: 400 },
    );
  }

  try {
    await dbConnect();

    const company = await Company.findById(companyId);
    if (!company) {
      return Response.json(
        { success: false, message: 'Company not found' },
        { status: 200 },
      );
    }

    return Response.json({
      success: true,
      name: company.name,
    });
  } catch (error) {
    console.error('Error fetching company name:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
