import dbConnect from "@/utils/dbConnects";
import Participant from "../api/models/Participant";
import crypto from 'crypto';


const DOMAIN = process.env.DOMAIN

export async function sendResetLink(email) {
    await dbConnect();
    if (!email) {
        throw new Error("Missing required fields")
    }
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const user = await Participant.findOne({ email })

        if (user) {
            user.resetToken = token;
            user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; 
            await user.save();
          }

        const resetLink = `${DOMAIN}/forgot-password?step=reset&token=${token}`;

        console.log(resetLink)

        return resetLink;

    } catch (error) {
        throw new Error(error.message || "Password Reset Failed!");
    }


}
