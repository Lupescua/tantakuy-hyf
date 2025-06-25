import { saveVote, countVotesForEntry } from "@/app/services/voteServices";
import { cookies } from "next/headers";
import dbConnect from "@/utils/dbConnects";
import { verifyToken } from '@/utils/jwt'


export async function Post(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { entry, voteType } = body;

        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const decoded = verifyToken(token);
        const participantId = decoded.id

        const voteResult = await saveVote({
            entryId: entry,
            participantId: participantId,
            voteType,
        })
        if (!voteResult.success) {
            return Response.json({ success: false, message: voteResult.message }, { status: 400 });
        }
        return Response.json({ success: true, vote: voteResult.data }, { status: 201 });

    } catch (error) {
        console.error("POST /api/vote error:", error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function Get(req) {
    try {
        const { searchParams } = new URL(req.URL)
        const entryId = searchParams.get("entryId")
        if (!entryId) {
            return Response.json({ success: false, message: "Missing entryId" }, { status: 400 });
        }

        const result = await countVotesForEntry({ entryId });

        if (!result.success) {
            return Response.json({ success: false, message: result.message }, { status: 400 });
        }

        return Response.json({ success: true, votes: result.data }, { status: 200 });

    } catch (error) {
        console.error("GET /api/vote error:", error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}