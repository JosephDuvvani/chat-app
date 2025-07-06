import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  createUser,
  deleteUser,
  getUserByClerkId,
  updateUser,
} from "@/features/users/db/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headers = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  if (
    !headers["svix-id"] ||
    !headers["svix-timestamp"] ||
    !headers["svix-signature"]
  ) {
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();

  const secret = process.env.WEBHOOK_SECRET!;
  const wh = new Webhook(secret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        primary_email_address_id,
      } = evt.data;

      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      if (!primaryEmail) {
        return new NextResponse("No primary email found", { status: 400 });
      }

      await createUser({
        name: `${first_name} ${last_name ? last_name : ""}`.trim(),
        email: primaryEmail.email_address,
        imageUrl: image_url,
        clerkId: id,
      });
    } catch (error) {
      return new NextResponse("Error creating user in database", {
        status: 400,
      });
    }
  }

  if (eventType === "user.updated") {
    const {
      id,
      image_url,
      first_name,
      last_name,
      email_addresses,
      primary_email_address_id,
    } = evt.data;

    const primaryEmail = email_addresses.find(
      (email) => email.id === primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      return new NextResponse("No primary email found", { status: 400 });
    }

    const user = await getUserByClerkId(id);

    if (!user) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    const name = `${first_name ? first_name : ""} ${
      last_name ? last_name : ""
    }`.trim();

    if (
      image_url === user.imageUrl &&
      primaryEmail === user.email &&
      name === user.name
    ) {
      return new NextResponse("", { status: 200 });
    }

    await updateUser(user.id, {
      imageUrl: image_url,
      email: primaryEmail,
      name,
    });
  }

  if (eventType === "user.deleted") {
    try {
      const { id, deleted } = evt.data;

      if (!deleted || !id) {
        return new NextResponse("Error occured", { status: 400 });
      }

      const user = await getUserByClerkId(id);

      if (!user) {
        return new NextResponse("User not found in database", { status: 404 });
      }

      await deleteUser(user.id);
    } catch (error) {
      return new NextResponse("Error deleting user in database", {
        status: 400,
      });
    }
  }

  return new NextResponse("Webhook recieved successfully", { status: 200 });
}
