import Participant from '../api/models/Participant';
import dbConnect from '@/utils/dbConnects';

export const validateToken = async ( email, token ) => {
    await dbConnect()
    const loginParticipant = await Participant.findOne({ email })
    if(!loginParticipant){
        return { success: false, message: "Invalid" };
    }
    if (loginParticipant.resetToken === token) {

        return { success: true, message: "Valid" };

    }else{
        
        return { success: false, message: "Invalid" };
    }


}