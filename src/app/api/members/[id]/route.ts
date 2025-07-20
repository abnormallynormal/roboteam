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
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { date, status } = await request.json();

    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const db = client.db("roboteam");
    await db
      .collection("members")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { present: date } }
      );
    await db
      .collection("members")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { late: date } }
      );
    await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id) }, { $pull: { absent: date } });

    // 2. Add to the correct array
    const result = await db.collection("members").updateOne(
      { _id: new ObjectId(id) },
      { $push: { [status]: date } } // Dynamic key based on status
    );

    await client.close();
    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
