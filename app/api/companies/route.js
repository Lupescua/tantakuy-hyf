import Company from '@/app/api/models/Company';
import { createCompany } from '@/app/services/companyServices';
import { withDB } from '@/utils/withDB';
import { success, created, serverError, badRequest, error } from '@/utils/apiResponse';

async function getCompanies() {
  try {
    const companies = await Company.find().select('_id companyName').lean();
    return success({ companies });
  } catch (err) {
    console.error('Error fetching companies:', err);
    return serverError('Failed to fetch companies', err);
  }
}

export const GET = withDB(getCompanies);

async function createCompanyHandler(req) {
  try {
    const body = await req.json();
    const company = await createCompany(body);
    return created({ company });
  } catch (err) {
    // Preserve the original status code from AppError
    const status = err?.statusCode ?? err?.status;
    if (typeof status === 'number') {
      return error(err.message, status);
    }
    return serverError('Failed to create company', err);
  }
}

export const POST = withDB(createCompanyHandler);
