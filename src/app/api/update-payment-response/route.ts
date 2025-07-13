import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function PATCH(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { document, name, paid } = await request.json();
    const db = client.db("roboteam");
    const result = await db
      .collection("payments")
      .updateOne(
        { name: document, "responses.name": name },
        { $set: { "responses.$.paid": paid } }
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
