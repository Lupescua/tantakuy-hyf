import Participant from "../api/models/Participant";
import { generateToken } from "@/utils/jwt";
import { AppError } from "@/utils/errorHandler"

export async function loginUser(login = {}) {
    const { email, password } = login;
    if (!email || !password) {
        throw new AppError("Email and password are required.", 400);
    }
    const participant = await Participant.findOne({ email })

    if (!participant) {
        throw new AppError("Email or password is incorrect.", 401);
    }

    const isMatch = await participant.comparePassword(password);

    if (!isMatch) {
        throw new AppError("Email or password is incorrect.", 401);
    }

    const token = generateToken({
        id: participant._id,
        email: participant.email,
        userName: participant.userName,
    });


    return { token, user: participant };

}
