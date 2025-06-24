import Vote from "../api/models/Vote";
import dbConnect from "@/utils/dbConnects";
import { getUserFromToken } from '@/utils/jwt';


export const saveVote = async ({ entryId, participantId, voteType }) => {
    if (!entryId || !participantId || !voteType) {
        throw new Error("Missing required fields");
    }
    try {
        const vote = await Vote.create({
            entry: entryId,
            participant: participantId,
            voteType,
        });
        return vote;
    } catch (error) {
        throw new Error(`Couldn't save the vote ${error}`)
    }

}

export const countVotesForEntry = async({entryId}) => {
    if(!entryId){
        throw new Error("Missing required fields");
    }
    try {

        const voteCount = await Vote.countDocuments({ entry: entryId })
        .populate('entry', 'title');
        return voteCount;

    } catch (error) {
        throw new Error(`Can't get data ${error}`)
    }
}