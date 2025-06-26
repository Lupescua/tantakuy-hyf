import Participant from "../api/models/Participant";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AppError } from "@/utils/errorHandler";

const DOMAIN = process.env.DOMAIN

export async function resetPassword(forgotObj = {}) {
    const { email, newPassword } = forgotObj;

    if (!newPassword) {
        throw new AppError("Password is required.")
    }
    const user = await Participant.findOne({
        resetToken: req.query.token,
        resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) {
        throw new AppError("Reset token is invalid or has expired.", 410);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return {
        user: {
            email: user.email,
            userName: user.userName,
        },
    };
}