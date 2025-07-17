import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const payments = await db.collection("signout").find().toArray();

    await client.close();
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { email, item, initial, remaining } = await request.json();
    const db = client.db("roboteam");
    const result = await db.collection("signout").insertOne({
      email: email,
      date: new Date().toISOString(),
      item: item,
      initial: initial,
      remaining: remaining,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
  
}

export async function PATCH(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { email, item, originalQuantity, returnQuantity } = await request.json();
    const db = client.db("roboteam");
    const result = await db.collection("signout").updateOne({ _id: new ObjectId(item as string) }, {$set: {remaining: (originalQuantity-returnQuantity)}});
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
