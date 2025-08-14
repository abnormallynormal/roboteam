import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";

const uri = process.env.MONGODB_URI!;
const secret = process.env.NEXTAUTH_SECRET!;

export async function GET(request: Request) {
  try {
    // Get the session token and extract user info
    const token = await getToken({
      req: request,
      secret: secret,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const user = await db.collection("users").findOne({
      email: token.email,
    });

    await client.close();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      role: user.accessLevel,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 }
    );
  }
}
