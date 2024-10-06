import { UpdateStatusWebhookBody } from "@/interface";
import { createAndLinkTranscodedVideos } from "@/lib/action/video.action";
import Pusher from "pusher";
import { NextResponse } from "next/server";

const pusherOptions = {
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
  useTLS: true,
};

export async function POST(req: Request) {
  const pusher = new Pusher(pusherOptions);
  let userId = "";
  let data: UpdateStatusWebhookBody["data"] | null = null;
  try {
    console.log("Parsing the request body");

    const { success, message, data }: UpdateStatusWebhookBody =
      await req.json();

    if (!success || !message || !data) {
      console.log("Invalid request body");
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }
    const { uniqueId, transcodedVideo } = data;
    if (!uniqueId || !transcodedVideo) {
      console.log("Invalid data in request body");
      return NextResponse.json(
        { message: "Invalid data in request body" },
        { status: 400 }
      );
    }
    console.log(
      `Received status update: ${success} for ${uniqueId} - ${message}`
    );
    const response = await createAndLinkTranscodedVideos(
      uniqueId,
      success ? "FINISHED" : "FAILED",
      transcodedVideo
    );

    if (!response.success || !response.data) {
      console.log("Failed to update status");
      return NextResponse.json(
        { message: "Failed to update status" },
        { status: 500 }
      );
    }
    userId = response?.data;

    if (!userId) {
      console.log("Failed to get user id");
      return NextResponse.json(
        { message: "Failed to get user id" },
        { status: 500 }
      );
    }
    pusher.trigger(userId, "statusUpdate", {
      success,
      message,
      data,
    });

    return NextResponse.json({ message: "Status updated" }, { status: 200 });
  } catch (error) {
    console.error("Error handling status update request:", error);
    pusher.trigger(userId, "statusUpdate", {
      success: false,
      message: "Internal server error",
      data,
    });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
