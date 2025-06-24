import { saveVote, countVotesForEntry } from "@/app/services/voteServices";
import { cookies } from "next/headers";
import dbConnect from "@/utils/dbConnects";
import { verifyToken } from '@/utils/jwt'


export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { entry, voteType } = body;

        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            throw new Error("Unauthorized!")
        }
        const decoded = verifyToken(token);
        const participantId = decoded.id

        const vote = await saveVote({
            entryId: entry,
            participantId: participantId,
            voteType,
        })
        return Response.json({ success: true, vote }, { status: 201 });

    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 401 });
    }

}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.URL)
        const entryId = searchParams.get("entryId")
        if (!entryId) {
            return Response.json({ success: false, message: "Missing entryId" }, { status: 400 });
        }
        const votes = await countVotesForEntry({ entry: entryId });
        console.log(votes)
        return Response.json({ success: true, votes }, { status: 200 });

    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 401 });
    }
}