import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const members = await db.collection("members").find().toArray();

    await client.close();
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { name, email, team } = await request.json();

    const db = client.db("roboteam");
    const result = await db.collection("members").insertOne({
      name, 
      email,
      team,
    });
    return NextResponse.json(result)
    await client.close();
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { id, name, email, team } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const db = client.db("roboteam");
    const result = await db.collection("members").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, email, team } }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const db = client.db("roboteam");
    const result = await db.collection("members").deleteOne({
      _id: new ObjectId(id),
    });

    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}