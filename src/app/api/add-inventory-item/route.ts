import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { collection, team, name, category, amount, description } =
      await request.json();
    const db = client.db("inventory");
    const result = await db.collection(collection).updateOne(
      {
        team: team,
      },
      {
        $push: {
          items: {
            id: new ObjectId().toString(),
            name: name,
            category: category,
            amount: amount,
            description: description,
          } as never,
        },
      }
    );

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
    const { collection, team, id, name, category, amount, description} = await request.json();
    const db = client.db("inventory");
    const result = await db
      .collection(collection)
      .updateOne(
        { team: team, "items.id": id },
        { $set: { "items.$.name": name, "items.$.category": category, "items.$.amount": amount, "items.$.description": description } }
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const { collection, team, id } = await request.json();
    const db = client.db("inventory");

    const result = await db
      .collection(collection)
      .updateOne({ team: team }, { $pull: { items: { id: id } as never } });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
