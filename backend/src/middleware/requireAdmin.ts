import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function extractUserId(req: Request): string | undefined {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = extractUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized - No user ID provided',
      });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized - User not found',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Forbidden - Admin access required',
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Internal Server Error',
    });
  }
}
