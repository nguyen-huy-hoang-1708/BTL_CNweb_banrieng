import { Request, Response } from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllRoadmapsAdmin,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  createModule,
  updateModule,
  deleteModule,
} from './admin.services';

// User Management Handlers
export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      success: true,
      data: users,
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

export async function updateUserRoleHandler(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invalid role. Must be "user" or "admin"',
      });
    }

    const user = await updateUserRole(userId, role);
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

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    return res.status(200).json({
      success: true,
      data: { message: 'User deleted successfully' },
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

// Roadmap Management Handlers
export async function getAllRoadmapsHandler(req: Request, res: Response) {
  try {
    const roadmaps = await getAllRoadmapsAdmin();
    return res.status(200).json({
      success: true,
      data: roadmaps,
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

export async function createRoadmapHandler(req: Request, res: Response) {
  try {
    const { title, description, image_url, category } = req.body;
    
    // Get creator from request header
    const creatorId = req.headers['x-user-id'] as string;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Title, description, and category are required',
      });
    }

    const roadmap = await createRoadmap({ 
      title, 
      description, 
      image_url, 
      category,
      created_by: creatorId 
    });
    return res.status(201).json({
      success: true,
      data: roadmap,
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

export async function updateRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    const { title, description, image_url, category } = req.body;

    const roadmap = await updateRoadmap(roadmapId, { title, description, image_url, category });
    return res.status(200).json({
      success: true,
      data: roadmap,
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

export async function deleteRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    await deleteRoadmap(roadmapId);
    return res.status(200).json({
      success: true,
      data: { message: 'Roadmap deleted successfully' },
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

// Module Management Handlers
export async function createModuleHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    const { title, description, content, order_index } = req.body;

    if (!title || order_index === undefined) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Title and order_index are required',
      });
    }

    const module = await createModule(roadmapId, { title, description, content, order_index });
    return res.status(201).json({
      success: true,
      data: module,
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

export async function updateModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const { title, description, content, order_index } = req.body;

    const module = await updateModule(moduleId, { title, description, content, order_index });
    return res.status(200).json({
      success: true,
      data: module,
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

export async function deleteModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    await deleteModule(moduleId);
    return res.status(200).json({
      success: true,
      data: { message: 'Module deleted successfully' },
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
