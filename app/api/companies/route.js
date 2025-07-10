import dbConnect from '@/utils/dbConnects';
import Company from '@/app/api/models/Company';
import { createCompany } from '@/app/services/companyServices';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find().select('_id companyName').lean();
    return NextResponse.json({ success: true, data: companies });
  } catch (err) {
    console.error('Error fetching companies:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch companies' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const company = await createCompany(body);
    return NextResponse.json({ success: true, data: company }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
