import conectDB from "@/lib/dbConfig";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await conectDB();
    const session = await getServerSession();
    const { user } = session || {};
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const post = await Post.create({
      content,
      auther: user._id,
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post creation failed" },
        { status: 500 }
      );
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { posts: post._id },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await conectDB();
    const session = await getServerSession();
    const { user } = session || {};
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json(
        { message: "Image ID is required" },
        { status: 400 }
      );
    }
    const post = await Post.findById(imageId);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        massage: "Post fetched successfully",
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("post Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await conectDB();
    const session = await getServerSession();
    const { user } = session || {};
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $pull: { posts: post._id },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "Post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
