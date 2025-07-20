import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("roboteam");
    const transactions = await db.collection("transactions").find().toArray();

    await client.close();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { type, amount, description, category, date } = await request.json();

    const db = client.db("roboteam");
    const result = await db.collection("transactions").insertOne({
      type,
      description,
      amount,
      category,
      date,
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

    const { id, type, description, amount, category } = await request.json();

    const db = client.db("roboteam");
    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(id as string) },
      { $set: { type: type, description: description, amount: amount, category: category} }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const { id } = await request.json();

    const db = client.db("roboteam");
    const result = await db.collection("transactions").deleteOne({
      _id: new ObjectId(id as string),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
