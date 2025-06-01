"use server";

import { getServerSession } from "next-auth";

export async function getAdminStatus() {
  const session = await getServerSession();
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;
  return isAdmin || false;
}