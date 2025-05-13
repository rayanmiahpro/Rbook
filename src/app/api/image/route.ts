import conectDB from "@/lib/dbConfig";
import Image, { IImage } from "@/models/Image";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await conectDB();

    const session = await getServerSession();

    const { user } = session || {};

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const corentSetionUser = await User.findById(user.id);

    if (!corentSetionUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, description, image } = await request.json();

    if (!title || !description || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newImage = await Image.create({
      title,
      description,
      image,
      author: corentSetionUser._id,
    });

    if (!newImage) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    corentSetionUser.images.push(newImage._id);

    await corentSetionUser.save();

    return NextResponse.json(
      { message: "Image uploaded successfully", image: newImage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/image:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await conectDB();

    const session = await getServerSession();

    const { user } = session || {};

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const corentSetionUser = await User.findById(user._id);

    if (!corentSetionUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id") || "";

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(
      { massage: "Image fetched successfully", image },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/image:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
    try {
        await conectDB();
    
        const session = await getServerSession();
    
        const { user } = session || {};
    
        if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const corentSetionUser = await User.findById(user._id);
    
        if (!corentSetionUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    
        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get("id") || "";
    
        if (!imageId) {
        return NextResponse.json(
            { error: "Image ID is required" },
            { status: 400 }
        );
        }
    
        const image = await Image.findById(imageId);
        if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }
    
        await Image.deleteOne({ _id: imageId });
    
        corentSetionUser.images.pull(imageId);
        await corentSetionUser.save();
    
        return NextResponse.json(
        { message: "Image deleted successfully" },
        { status: 200 }
        );
    } catch (error) {
        console.error("Error in DELETE /api/image:", error);
        return NextResponse.json(
        {
            error: "An error occurred while processing your request.",
            details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
        );
    }
}

