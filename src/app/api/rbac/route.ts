import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";

const uri = process.env.MONGODB_URI!;
const secret = process.env.NEXTAUTH_SECRET!;

export async function GET(request: Request) {
  try {
    const email = request.headers.get('X-User-Email');

    if (!email) {
      return NextResponse.json({ error: "Email not provided" }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const user = await db.collection("users").findOne({
      email: email,
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
