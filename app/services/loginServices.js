import Participant from "../api/models/Participant";
import { generateToken } from "@/utils/jwt";
export async function loginUser(login = {}) {

    
    const { email, password } = login;

    console.log(email, password)
    if (!email || !password) {
        throw new Error("Missing required fields")
    }
    try {
        const participant = await Participant.findOne({ email })

        if (!participant) {
            throw new Error("User not found");
        }

        const isMatch = await participant.comparePassword(password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken({
            id: participant._id,
            email: participant.email,
            userName: participant.userName,
          });


        return { token, user: participant };
    } catch (error) {
        throw new Error(error.message || "Login failed");
    }


}
