import Company from '@/app/api/models/Company';
import { createCompany } from '@/app/services/companyServices';
import { NextResponse } from 'next/server';
import { withDB } from '@/utils/withDB';

async function getCompanies() {
  try {
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

export const GET = withDB(getCompanies);

async function createCompanyHandler(req) {
  try {
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

export const POST = withDB(createCompanyHandler);
