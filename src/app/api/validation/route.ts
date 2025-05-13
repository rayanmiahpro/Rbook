import conectDB from "@/lib/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { varifyCode } = await request.json();
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "username is requerd" },
        { status: 404 }
      );
    }

    await conectDB();

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isCodeValid = user.varifyCode === varifyCode;
    const isCodeExpired = user.varifyCodeExpires < Date.now();

    if (!isCodeValid && isCodeExpired) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (isCodeValid && !isCodeExpired) {
      return NextResponse.json(
        {
          massage: "Verification code is expired ",
        },
        { status: 400 }
      );
    }

    await User.updateOne(
      {
        username,
      },
      {
        $set: {
          varifyCode: "",
          varifyCodeExpires: 0,
          isVarified: true,
        },
        new: true,
      }
    );

    return NextResponse.json(
      { message: "User verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
