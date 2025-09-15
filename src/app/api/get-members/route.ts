import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const members = await db.collection("attendance").find().toArray();

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
    const { members } = await request.json();

    const db = client.db("roboteam");
    
    const results = await Promise.all(
      members.map(async (member: any) => {
        return await db.collection("attendance").insertOne({
          _id: new ObjectId(),
          name: member.name,
          team: member.team,
          present: [],
          absent: [],
          late: [],
        });
      })
    );

    await client.close();
    
    return NextResponse.json({
      message: "Members added successfully",
      insertedCount: results.length,
      results: results
    });
  } catch (error) {
    console.error("Error adding members:", error);
    return NextResponse.json(
      { error: "Failed to add members" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    
    // Delete all documents in the attendance collection
    const result = await db.collection("attendance").deleteMany({});

    await client.close();
    
    return NextResponse.json({
      message: "All attendance records deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error deleting attendance records:", error);
    return NextResponse.json(
      { error: "Failed to delete attendance records" },
      { status: 500 }
    );
  }
}
