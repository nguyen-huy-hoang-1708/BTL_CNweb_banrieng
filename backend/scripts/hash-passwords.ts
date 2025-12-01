import prisma from '../src/services/prisma.service';
import bcrypt from 'bcryptjs';

async function hashPasswords() {
    try {
        // Get all users with plaintext password 'pw'
        const users = await prisma.user.findMany();
        
        console.log(`Found ${users.length} users`);
        
        // Hash password 'password123' for all users
        const hashedPassword = await bcrypt.hash('password123', 10);
        console.log('Generated hash:', hashedPassword);
        
        // Update all users
        for (const user of users) {
            if (user.password_hash === 'pw') {
                await prisma.user.update({
                    where: { user_id: user.user_id },
                    data: { password_hash: hashedPassword }
                });
                console.log(`Updated user: ${user.email}`);
            }
        }
        
        console.log('✅ All passwords updated successfully!');
        console.log('You can now login with password: password123');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

hashPasswords();
