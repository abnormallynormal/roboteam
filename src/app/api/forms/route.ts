import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const forms = await db.collection("forms").find().toArray();

    await client.close();
    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { name, type, amount, suppForms } = await request.json();
    const db = client.db("roboteam");
    const result = await db.collection("forms").insertOne(
      {
        name,
        date: (new Date()).toISOString(),
        responses: [
          {
            _id: new ObjectId(),
            name: "",
            team: "",
            amount: 0,
            paid: false,
          },
        ]
      }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating forms:", error);
    return NextResponse.json(
      { error: "Failed to update forms" },
      { status: 500 }
    );
  }
}
