import { Request, Response } from 'express';
import { createUser, loginUser } from './auth.services';
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