import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function createUser(input: Omit<User, 'user_id' | 'created_at' | 'updated_at' | 'current_level' | 'role' | 'avatar_url' | 'password_hash'> & { password: string }): Promise<User> {
    const {email, password, full_name } = input;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            password_hash, 
            full_name
        },
    });

    return user;
}

export async function loginUser(email: string, password: string): Promise<{ user: Omit<User, 'password_hash'>, token: string } | null> {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        return null;
    }

    const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
}

export async function getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
    });

    if (!user) {
        return null;
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function updateUserProfile(userId: string, updates: { full_name?: string; avatar_url?: string }): Promise<Omit<User, 'password_hash'> | null> {
    const user = await prisma.user.update({
        where: { user_id: userId },
        data: updates,
    });

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
    });

    if (!user) {
        return false;
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
        return false;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
        where: { user_id: userId },
        data: { password_hash },
    });

    return true;
}