import conectDB from "@/lib/dbConfig";
import User from "@/models/User";
import Video from "@/models/Video";
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

    const { title, description, video, thumbnail } = await request.json();

    if (!title || !description || !video || !thumbnail) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newVideo = await Video.create({
      title,
      description,
      video,
      thumbnail,
      author: user._id,
    });

    if (!newVideo) {
      return NextResponse.json(
        { error: "Failed to upload video" },
        { status: 500 }
      );
    }

    await User.findByIdAndUpdate(user._id, {
      $push: { videos: newVideo._id },
    });

    return NextResponse.json(
      { message: "Video uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/video:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
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

    const { searchParams } = new URL(request.url);

    const videoId = searchParams.get("id") || "";

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(
      { massage: "Video fetched successfully", video },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/video:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
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

    const { searchParams } = new URL(request.url);

    const videoId = searchParams.get("id") || "";

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    await Video.findByIdAndDelete(videoId);

    await User.findByIdAndUpdate(user._id, { $pull: { videos: videoId } });
    return NextResponse.json(
      { message: "Video deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/video:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
