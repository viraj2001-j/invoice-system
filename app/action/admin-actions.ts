"use server"

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

/**
 * Update Admin Node
 */
export async function updateAdmin(id: number, data: { username?: string; password?: string }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "SUPERADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const updatePayload: any = {};
    if (data.username) updatePayload.username = data.username;
    if (data.password && data.password.trim() !== "") {
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updatePayload,
    });

    revalidatePath("/superadmin/admins");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "Username taken" };
    return { success: false, error: "Update failed" };
  }
}

/**
 * Delete Admin Node
 */
export async function deleteAdmin(id: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "SUPERADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Safety: Prevent self-deletion
    if (Number((session.user as any).id) === id) {
      return { success: false, error: "Cannot terminate your own root node" };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/superadmin/admins");
    return { success: true };
  } catch (error) {
    return { success: false, error: "De-provisioning failed" };
  }
}