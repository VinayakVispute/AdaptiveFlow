import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const newUser = await prisma.user.create({
      data: {
        clerkId: id,
        name: `${first_name} ${last_name}`,
        userName: username || "",
        email: email_addresses[0].email_address,
        picture: image_url,
      },
    });
    if (!newUser) {
      return NextResponse.json(
        { message: "Error occured" },
        {
          status: 400,
        }
      );
    }
    await clerkClient.users.updateUserMetadata(id, {
      privateMetadata: {
        userId: newUser.id,
      },
    });
    return NextResponse.json({ message: "User Created" }, { status: 200 });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const updatedUser = await prisma.user.update({
      where: {
        clerkId: id,
      },
      data: {
        name: `${first_name} ${last_name}`,
        userName: username || "",
        email: email_addresses[0].email_address,
        picture: image_url,
      },
    });
    if (!updatedUser) {
      return NextResponse.json(
        { message: "Error occured" },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await prisma.user.delete({
      where: {
        clerkId: id,
      },
    });
    if (!deletedUser) {
      return NextResponse.json(
        { message: "Error occured" },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({ message: "User Deleted" }, { status: 200 });
  }

  return NextResponse.json({ message: "OK" });
}
