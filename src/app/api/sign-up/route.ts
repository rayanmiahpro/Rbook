import { sendVerificationEmail } from "@/helpers/sendVarifyEmail";
import conectDB from "@/lib/dbConfig";
import User from "@/models/User";

import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await conectDB();

  try {
    const { FullName, username, email, password, avator, coverImage } =
      await request.json();

    const varifyedExgistingUserByusername = await User.findOne({
      username,
      isVarified: true,
    });

    if (varifyedExgistingUserByusername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const varifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const varifyCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);

    const ExgistingUserByEmail = await User.findOne({ email });

    if (ExgistingUserByEmail) {
      const varifyedExgistingUserByEmail =
        ExgistingUserByEmail.isVarified === true;

      if (varifyedExgistingUserByEmail) {
        return NextResponse.json(
          { error: "user is allready exjist by this email plige logIn " },
          { status: 400 }
        );
      } else {
        ExgistingUserByEmail.username = username;
        ExgistingUserByEmail.password = password;
        ExgistingUserByEmail.FullName = FullName;
        ExgistingUserByEmail.avator = avator;
        ExgistingUserByEmail.coverImage = coverImage || "";
        ExgistingUserByEmail.varifyCode = varifyCode;
        ExgistingUserByEmail.varifyCodeExpiry = varifyCodeExpiry;
        await ExgistingUserByEmail.save();
      }
    } else {
      const newUser = await User.create({
        FullName,
        username,
        email,
        password,
        avator,
        coverImage: coverImage || "",
        varifyCode,
        varifyCodeExpiry,
      });

      if (!newUser) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    }

    try {
      await sendVerificationEmail(email, varifyCode, username);
    } catch (error) {
      console.error("Error sending email", error);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/sign-up", error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
