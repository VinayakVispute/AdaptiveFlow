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
    console.log("Starting to handle POST request for status update.");

    // Parse the incoming JSON request body
    const {
      success,
      message,
      data: requestData,
    }: UpdateStatusWebhookBody = await req.json();
    console.log("Parsed request body:", {
      success,
      message,
      data: requestData,
    });

    // Validate request body structure
    if (!success || !message || !requestData) {
      console.log("Request body validation failed:", {
        success,
        message,
        data: requestData,
      });
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Extract uniqueId and transcodedVideo from data
    const { uniqueId, transcodedVideo } = requestData;
    console.log("Data extracted:", { uniqueId, transcodedVideo });

    // Check if required data fields are present
    if (!uniqueId || !transcodedVideo) {
      console.log(
        "Data validation failed. Either uniqueId or transcodedVideo is missing."
      );
      return NextResponse.json(
        { message: "Invalid data in request body" },
        { status: 400 }
      );
    }

    console.log(`Received status update for uniqueId: ${uniqueId}`);
    console.log(`Status details - Success: ${success}, Message: ${message}`);

    // Update status in the database
    const response = await createAndLinkTranscodedVideos(
      uniqueId,
      success ? "FINISHED" : "FAILED",
      transcodedVideo
    );
    console.log("Response from createAndLinkTranscodedVideos:", response);

    // Check if the response indicates success
    if (!response.success || !response.data) {
      console.log("Status update in database failed.");
      return NextResponse.json(
        { message: "Failed to update status" },
        { status: 500 }
      );
    }

    // Extract userId from response data
    userId = response.data;
    console.log("User ID linked to this status update:", userId);

    if (!userId) {
      console.log("Failed to retrieve userId after status update.");
      return NextResponse.json(
        { message: "Failed to get user id" },
        { status: 500 }
      );
    }

    // Send a Pusher event to notify the client of the update
    console.log(`Triggering Pusher event for userId: ${userId}`);
    pusher.trigger(userId, "statusUpdate", {
      success,
      message,
      data: requestData,
    });

    console.log("Status update completed successfully. Returning response.");
    return NextResponse.json({ message: "Status updated" }, { status: 200 });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error handling status update request:", error);
    console.log(
      `Triggering Pusher event for userId: ${userId} with failure message.`
    );

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
