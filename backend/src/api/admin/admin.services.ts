import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// User Management
export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      user_id: true,
      email: true,
      full_name: true,
      role: true,
      current_level: true,
      created_at: true,
      avatar_url: true,
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  return await prisma.user.update({
    where: { user_id: userId },
    data: { role },
    select: {
      user_id: true,
      email: true,
      full_name: true,
      role: true,
    },
  });
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { user_id: userId },
  });
}

// Roadmap Management
export async function getAllRoadmapsAdmin() {
  return await prisma.roadmap.findMany({
    include: {
      modules: {
        select: {
          module_id: true,
          title: true,
          order_index: true,
        },
        orderBy: { order_index: 'asc' },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function createRoadmap(data: {
  title: string;
  description: string;
  image_url?: string;
  category: string;
  created_by: string;
}) {
  return await prisma.roadmap.create({
    data,
  });
}

export async function updateRoadmap(roadmapId: string, data: {
  title?: string;
  description?: string;
  image_url?: string;
  category?: string;
}) {
  return await prisma.roadmap.update({
    where: { roadmap_id: roadmapId },
    data,
  });
}

export async function deleteRoadmap(roadmapId: string) {
  await prisma.roadmap.delete({
    where: { roadmap_id: roadmapId },
  });
}

// Module Management
export async function createModule(roadmapId: string, data: {
  title: string;
  description?: string;
  content?: string;
  order_index: number;
}) {
  return await prisma.module.create({
    data: {
      ...data,
      roadmap_id: roadmapId,
    },
  });
}

export async function updateModule(moduleId: string, data: {
  title?: string;
  description?: string;
  content?: string;
  order_index?: number;
}) {
  return await prisma.module.update({
    where: { module_id: moduleId },
    data,
  });
}

export async function deleteModule(moduleId: string) {
  await prisma.module.delete({
    where: { module_id: moduleId },
  });
}
