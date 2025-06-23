import Company from "../api/models/Company";

export async function createCompany(company = {}) {

    const { name, position, companyName, businessNumber, cvrNumber, email, password } = company;
    const requiredFields = { name, companyName, password, email, cvrNumber };
    for (let [key, value] of Object.entries(requiredFields)) {
        if (!value) throw new Error(`${key} is required.`);
    }
    const existingEmail = await Company.findOne({ email });
    if (existingEmail) throw new Error('Email already in use.');

    const existingCvr = await Company.findOne({ cvrNumber });
    if (existingCvr) throw new Error('CVR Number already taken.');

    const existCompanyName = await Company.findOne({ companyName });
    if (existCompanyName) throw new Error('Company already in use.');

    const newCompany = new Company(company);

    await newCompany.save();

    return newCompany;


}