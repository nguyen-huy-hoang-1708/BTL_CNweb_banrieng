import { Request, Response } from 'express';
import { createUser } from './auth.services';
import { RegisterInput } from './auth.validation';

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