import { Request, Response } from 'express';
import { createUser, loginUser, getUserById, updateUserProfile, updateUserPassword } from './auth.services';
import { RegisterInput, LoginInput } from './auth.validation';

export async function registerUserHandler(req: Request, res: Response) {
    try {
        const userInput: RegisterInput = req.body;
        const user = await createUser(userInput);
        const { password_hash, ...userResponse} = user;
        
        return res.status(201).json({success: true, data: userResponse, error: null});
    } catch (error: any){
        if (error.code == 'P2002' && error.meta?.target?.includes('email')){
            return res.status(409).json({
                success: false,
                data: null,
                error: 'An user with this email already exists.',
            });
        }
        return res.status(500).json({
            success: false,
            data: null,
            error: 'Internal Server Error',
        });
    }
}

export async function loginUserHandler(req: Request, res: Response) {
    try {
        const loginInput: LoginInput = req.body;
        const result = await loginUser(loginInput.email, loginInput.password);
        
        if (!result) {
            return res.status(401).json({
                success: false,
                data: null,
                error: 'Invalid email or password',
            });
        }
        
        return res.status(200).json({
            success: true,
            data: {
                user: result.user,
                user_id: result.user.user_id,
                token: result.token,
            },
            error: null,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: 'Internal Server Error',
        });
    }
}

export async function getUserHandler(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                data: null,
                error: 'User not found',
            });
        }
        
        return res.status(200).json({
            success: true,
            data: user,
            error: null,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: 'Internal Server Error',
        });
    }
}

export async function updateUserProfileHandler(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const { full_name, avatar_url } = req.body;
        
        const user = await updateUserProfile(userId, { full_name, avatar_url });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                data: null,
                error: 'User not found',
            });
        }
        
        return res.status(200).json({
            success: true,
            data: user,
            error: null,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: 'Internal Server Error',
        });
    }
}

export async function updateUserPasswordHandler(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'Current password and new password are required',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'New password must be at least 6 characters',
            });
        }
        
        const success = await updateUserPassword(userId, currentPassword, newPassword);
        
        if (!success) {
            return res.status(401).json({
                success: false,
                data: null,
                error: 'Current password is incorrect',
            });
        }
        
        return res.status(200).json({
            success: true,
            data: { message: 'Password updated successfully' },
            error: null,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: 'Internal Server Error',
        });
    }
}