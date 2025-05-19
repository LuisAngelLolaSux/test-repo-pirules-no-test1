'use server';
import bcrypt from 'bcryptjs';

export const checkPassword = async (password1: string, password2: string) => {
    const passwordsMatch = await bcrypt.compare(password1, password2);
    return passwordsMatch;
};
