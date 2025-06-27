import Company from "../api/models/Company";
import { AppError } from "@/utils/errorHandler";

export async function createCompany(company = {}) {
  const {
    name,
    position,
    companyName,
    businessNumber,
    cvrNumber,
    email,
    password,
  } = company;

  const requiredFields = { name, companyName, password, email, cvrNumber };
  for (let [key, value] of Object.entries(requiredFields)) {
    if (!value) throw new AppError(`${key} is required.`, 400);
  }

  const [existingEmail, existingCvr, existingCompanyName] = await Promise.all([
    Company.findOne({ email }),
    Company.findOne({ cvrNumber }),
    Company.findOne({ companyName }),
  ]);

  if (existingEmail) {
    throw new AppError("Email already in use.", 409);
  }

  if (existingCvr) {
    throw new AppError("CVR Number already taken.", 409);
  }

  if (existingCompanyName) {
    throw new AppError("Company name already in use.", 409);
  }

  const newCompany = new Company({
    name,
    position,
    companyName,
    businessNumber,
    cvrNumber,
    email,
    password,
  });

  await newCompany.save();
  return newCompany;
}
