import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/config/nodemailer";
import { connectDB } from "@/config/connectDb";
import UserModel from "@/models/User";

export async function POST(request: NextRequest) {
  const host = request.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const DOMAIN = `${protocol}://${host}`;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const exituser = await UserModel.findOne({ email });

    if (!exituser) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const payload = {
      id: exituser._id.toString(),
    };

    const token = jwt.sign(payload, process.env.FORGOT_PASSWORD_SECRET_KEY!, {
      expiresIn: 60 * 60, // 1hr expiration
    });

    const resetURL = `${DOMAIN}/reset-password?token=${token}`;
    const emailHtml = `
                  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <p>
                      <a href="${resetURL}" style="color: #0070f3;">Reset Your Password</a>
                    </p>
                    <p>If you didn’t request this, you can ignore this email.</p>
                    <p>Thanks,<br/>Your Team</p>
                  </div>
    `;


    await sendEmail(exituser.email, "Forgot Password from Code!", emailHtml);

    return NextResponse.json({ message: "Check your email." }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
