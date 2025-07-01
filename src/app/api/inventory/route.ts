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
    const collections = await db.listCollections({ name }).toArray();
    if (collections.length > 0) {
      return NextResponse.json(
        { error: "Collection already exists" },
        { status: 409 }
      );
    }

    await db.collection(name).insertMany([
      { team: "82855G", items: [] },
      { team: "82855S", items: [] },
      { team: "82855T", items: [] },
      { team: "82855X", items: [] },
      { team: "82855Y", items: [] },
      { team: "82855Z", items: [] },
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
