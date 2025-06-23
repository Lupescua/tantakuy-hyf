import Participant from "../api/models/Participant";
import bcrypt from 'bcryptjs';

export async function resetPassword(forgotObj = {}) {
    const { email, newPassword } = forgotObj;
    console.log(forgotObj, "forgotObj")
    if (!newPassword) {
        throw new Error("Missing required fields")
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await Participant.findOne({ email })

        if (!user) {
            throw new Error("User not found");
        }
        await Participant.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        return { user: { email: user.email, userName: user.userName } };


    } catch (error) {
        throw new Error(error.message || "Password Reset Failed!");
    }


}
