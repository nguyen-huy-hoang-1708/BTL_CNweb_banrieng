import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

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