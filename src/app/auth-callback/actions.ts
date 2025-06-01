
"use server";

import { getServerSession } from "next-auth";
import { connectDB } from "@/config/connectDb";
import User from "@/models/User";

export const getAuthStatus = async () => {
  // Get session server-side
  const session = await getServerSession();
  console.log("Session:", session);

  if (!session?.user?.email) {
    throw new Error("Invalid user data");
  }

  await connectDB();

  // Query user with Mongoose by email
  const existingUser = await User.findOne({ email: session.user.email }).lean();

  if (!existingUser) {
    throw new Error("User not found in database");
  }

  return { success: true };
};
