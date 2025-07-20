import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI!;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { date, status } = await request.json();
    const { id } = await params;

    const db = client.db("roboteam");
    await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id) }, { $pull: { present: date } });
    await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id) }, { $pull: { late: date } });
    await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id) }, { $pull: { absent: date } });

    const result = await db.collection("members").updateOne(
      { _id: new ObjectId(id) },
      { $push: { [status]: date } }
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