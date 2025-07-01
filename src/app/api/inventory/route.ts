import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function GET(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("inventory");

    const collections = await db.listCollections().toArray();

    const result = Object.fromEntries(
      await Promise.all(
        collections.map(async (col) => [
          col.name,
          await db.collection(col.name).find().toArray(),
        ])
      )
    );

    await client.close();
    return NextResponse.json(result);
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

    const { name } = await request.json();

    const db = client.db("inventory");
    const result = await db.createCollection(name);
    await db.collection(name).insertMany([
      { name: "82855G", value: 100 },
      { name: "82855S", value: 200 },
      { name: "82855T", value: 300 },
      { name: "82855X", value: 300 },
      { name: "82855Y", value: 300 },
      { name: "82855Z", value: 300 },
    ]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
