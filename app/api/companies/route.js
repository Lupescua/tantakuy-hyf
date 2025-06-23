import { createCompany } from "@/app/services/companyServices";
import dbConnect from "@/utils/dbConnects";


export async function POST(req) {

    try {
        await dbConnect();
        const body = req.body();
        const company = await createCompany(body);
        return Response.json({ success: true, data: company }, { status: 201 });

    } catch (error) {
        return Response.json(
            { success: false, message: error.message },
            { status: 400 },
        );
    }

}